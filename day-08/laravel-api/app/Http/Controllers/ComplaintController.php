<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ComplaintController extends Controller
{
    /**
     * Display a listing of complaints.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Complaint::with(['facility', 'assignee']);

        if ($request->filled('facility_id')) {
            $query->where('facility_id', $request->query('facility_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->query('priority'));
        }

        $complaints = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Complaints retrieved successfully',
            'count' => $complaints->count(),
            'data' => $complaints
        ], 200);
    }

    /**
     * Store a newly created complaint in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'facility_id' => 'required|exists:facilities,id',
            'complaint_title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'nullable|in:Low,Medium,High,Urgent',
            'status' => 'nullable|in:Pending,In Progress,Resolved,Dismissed',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        if (!isset($data['status'])) {
            $data['status'] = 'Pending';
        }

        $complaint = Complaint::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Complaint logged successfully',
            'data' => $complaint->load('facility')
        ], 201);
    }

    /**
     * Display the specified complaint.
     */
    public function show(string $id): JsonResponse
    {
        $complaint = Complaint::with(['facility', 'assignee'])->find($id);

        if (!$complaint) {
            return response()->json([
                'success' => false,
                'message' => "Complaint with ID {$id} not found"
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Complaint retrieved successfully',
            'data' => $complaint
        ], 200);
    }

    /**
     * Update complaint status or details.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $complaint = Complaint::find($id);

        if (!$complaint) {
            return response()->json([
                'success' => false,
                'message' => "Complaint with ID {$id} not found"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'complaint_title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'priority' => 'nullable|in:Low,Medium,High,Urgent',
            'status' => 'nullable|in:Pending,In Progress,Resolved,Dismissed',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $complaint->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Complaint updated successfully',
            'data' => $complaint->fresh(['facility', 'assignee'])
        ], 200);
    }

    /**
     * Remove the specified complaint from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $complaint = Complaint::find($id);

        if (!$complaint) {
            return response()->json([
                'success' => false,
                'message' => "Complaint with ID {$id} not found"
            ], 404);
        }

        $complaint->delete();

        return response()->json([
            'success' => true,
            'message' => 'Complaint deleted successfully'
        ], 200);
    }
}
