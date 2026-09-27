<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InspectionController extends Controller
{
    /**
     * Display a listing of inspections.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Inspection::with(['facility', 'inspector']);

        if ($request->filled('facility_id')) {
            $query->where('facility_id', $request->query('facility_id'));
        }

        $inspections = $query->orderBy('inspection_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Inspections retrieved successfully',
            'count' => $inspections->count(),
            'data' => $inspections
        ], 200);
    }

    /**
     * Store a new inspection and atomically update parent facility scores.
     * Demonstrates DB transactions and Model relationship flow.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'facility_id' => 'required|exists:facilities,id',
            'inspector_id' => 'nullable|exists:users,id',
            'cleanliness_score' => 'required|integer|between:1,10',
            'odor_score' => 'required|integer|between:1,10',
            'waste_level' => 'required|in:Low,Medium,High',
            'water_available' => 'nullable|boolean',
            'notes' => 'nullable|string',
            'inspection_date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Atomic transaction: Insert inspection + update facility status & scores
        $inspection = DB::transaction(function () use ($validated) {
            $ins = Inspection::create($validated);

            // Determine new facility status
            $score = $validated['cleanliness_score'];
            $newStatus = 'Good';
            if ($score <= 3) {
                $newStatus = 'Critical';
            } elseif ($score <= 6) {
                $newStatus = 'Needs Cleaning';
            }

            Facility::where('id', $validated['facility_id'])->update([
                'cleanliness_score' => $score,
                'odor_score' => $validated['odor_score'],
                'waste_level' => $validated['waste_level'],
                'status' => $newStatus,
                'updated_at' => now()
            ]);

            return $ins;
        });

        return response()->json([
            'success' => true,
            'message' => 'Inspection logged and facility status updated',
            'data' => $inspection->load('facility')
        ], 201);
    }

    /**
     * Display the specified inspection.
     */
    public function show(string $id): JsonResponse
    {
        $inspection = Inspection::with(['facility', 'inspector'])->find($id);

        if (!$inspection) {
            return response()->json([
                'success' => false,
                'message' => "Inspection with ID {$id} not found"
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Inspection retrieved successfully',
            'data' => $inspection
        ], 200);
    }

    /**
     * Remove the specified inspection.
     */
    public function destroy(string $id): JsonResponse
    {
        $inspection = Inspection::find($id);

        if (!$inspection) {
            return response()->json([
                'success' => false,
                'message' => "Inspection with ID {$id} not found"
            ], 404);
        }

        $inspection->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inspection deleted successfully'
        ], 200);
    }
}
