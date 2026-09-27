<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class FacilityController extends Controller
{
    /**
     * Display a listing of facilities with optional filters.
     * Flow: Request -> Route -> Controller -> Model -> Database -> Response
     */
    public function index(Request $request): JsonResponse
    {
        $query = Facility::query()->withCount(['inspections', 'complaints']);

        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        // Search by name or location
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('location', 'ILIKE', "%{$search}%");
            });
        }

        // Sort option
        $sortBy = $request->query('sort_by', 'id');
        $sortOrder = $request->query('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $facilities = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Facilities retrieved successfully',
            'count' => $facilities->count(),
            'data' => $facilities
        ], 200);
    }

    /**
     * Store a newly created facility in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'status' => 'nullable|in:Good,Needs Cleaning,Under Maintenance,Critical',
            'cleanliness_score' => 'nullable|numeric|between:1,10',
            'odor_score' => 'nullable|numeric|between:1,10',
            'waste_level' => 'nullable|in:Low,Medium,High',
            'footfall' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $facility = Facility::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Facility created successfully',
            'data' => $facility
        ], 201);
    }

    /**
     * Display the specified facility with its inspections and complaints.
     */
    public function show(string $id): JsonResponse
    {
        $facility = Facility::with(['inspections', 'complaints'])->find($id);

        if (!$facility) {
            return response()->json([
                'success' => false,
                'message' => "Facility with ID {$id} not found"
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Facility retrieved successfully',
            'data' => $facility
        ], 200);
    }

    /**
     * Update the specified facility in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'success' => false,
                'message' => "Facility with ID {$id} not found"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'status' => 'nullable|in:Good,Needs Cleaning,Under Maintenance,Critical',
            'cleanliness_score' => 'nullable|numeric|between:1,10',
            'odor_score' => 'nullable|numeric|between:1,10',
            'waste_level' => 'nullable|in:Low,Medium,High',
            'footfall' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $facility->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Facility updated successfully',
            'data' => $facility
        ], 200);
    }

    /**
     * Remove the specified facility from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'success' => false,
                'message' => "Facility with ID {$id} not found"
            ], 404);
        }

        $facility->delete();

        return response()->json([
            'success' => true,
            'message' => 'Facility deleted successfully'
        ], 200);
    }

    /**
     * Get aggregate statistics for dashboard.
     */
    public function stats(): JsonResponse
    {
        $total = Facility::count();
        $avgCleanliness = Facility::avg('cleanliness_score');
        $critical = Facility::where('status', 'Critical')->count();
        $needsCleaning = Facility::where('status', 'Needs Cleaning')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_facilities' => $total,
                'average_cleanliness' => round($avgCleanliness, 2),
                'critical_facilities' => $critical,
                'needs_cleaning' => $needsCleaning
            ]
        ], 200);
    }
}
