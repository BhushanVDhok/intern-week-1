export interface Complaint {
  id: number;
  facility_id: number;
  facility_name?: string;
  complaint_title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Dismissed';
  assigned_to?: number;
  assignee_name?: string;
  created_at?: string;
}

export interface CreateComplaintDto {
  facility_id: number;
  complaint_title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}
