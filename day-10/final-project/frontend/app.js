/**
 * Smart Facility Management Dashboard
 * Day 10 Final Project — Frontend Application Controller
 *
 * Handles:
 *  - Tab navigation
 *  - Data loading from REST API (with in-memory fallback)
 *  - Rendering facilities, inspections, and complaints
 *  - Submitting inspection audit forms
 *  - Submitting and resolving complaint tickets
 */

const API_BASE = 'http://localhost:5000/api';

// Application State
let state = {
  facilities: [],
  complaints: [],
  metrics: {
    total_facilities: 6,
    average_cleanliness: 7.8,
    critical_facilities: 1,
    active_complaints: 2
  }
};

// Fallback in-memory data (used when backend is not running)
const fallbackData = {
  facilities: [
    { id: 1, name: 'Terminal 1 Main Restrooms',         location: 'Terminal 1 – Central Concourse',    capacity: 150, status: 'Good',             cleanliness_score: 8.8, odor_score: 1.8, waste_level: 'Low',    footfall: 1850, hours_since_cleaning: 1 },
    { id: 2, name: 'Terminal 1 Food Court Washrooms',   location: 'Terminal 1 – Food Plaza Level 2',   capacity: 220, status: 'Needs Cleaning',    cleanliness_score: 4.5, odor_score: 7.2, waste_level: 'High',   footfall: 4200, hours_since_cleaning: 5 },
    { id: 3, name: 'Transit Lounge Washrooms',          location: 'Terminal 2 – Gate B4',              capacity: 100, status: 'Good',             cleanliness_score: 9.2, odor_score: 1.2, waste_level: 'Low',    footfall: 780,  hours_since_cleaning: 2 },
    { id: 4, name: 'Ground Transport Restrooms',        location: 'Basement Level – Bus Hub',           capacity: 80,  status: 'Under Maintenance', cleanliness_score: 5.8, odor_score: 4.5, waste_level: 'Medium', footfall: 1950, hours_since_cleaning: 4 },
    { id: 5, name: 'Cargo & Baggage Bay Washrooms',     location: 'Hangar 3 – Ground Level',           capacity: 60,  status: 'Critical',         cleanliness_score: 3.2, odor_score: 8.9, waste_level: 'High',   footfall: 610,  hours_since_cleaning: 8 },
    { id: 6, name: 'Executive Lounge Restrooms',        location: 'Terminal 1 – Mezzanine Level',      capacity: 50,  status: 'Good',             cleanliness_score: 9.6, odor_score: 1.0, waste_level: 'Low',    footfall: 320,  hours_since_cleaning: 1 }
  ],
  complaints: [
    { id: 1, facility_id: 2, complaint_title: 'Trash bin overflowing',          description: 'Spilling on floor near sink.',   priority: 'High',   status: 'Pending',     facility_name: 'Terminal 1 Food Court Washrooms' },
    { id: 2, facility_id: 2, complaint_title: 'Hand dryer not functioning',      description: 'Not blowing warm air.',          priority: 'Medium', status: 'In Progress', facility_name: 'Terminal 1 Food Court Washrooms' },
    { id: 3, facility_id: 5, complaint_title: 'Strong sewer odor near entrance', description: 'Pungent odor noticeable.',       priority: 'Urgent', status: 'Pending',     facility_name: 'Cargo & Baggage Bay Washrooms'   }
  ]
};

// ─────────────────────────────────────────────────
// Initialisation
// ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupAuditForm();
  setupComplaintForm();
  loadData();
});

// ─────────────────────────────────────────────────
// Tab Navigation
// ─────────────────────────────────────────────────
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
  });
}

// ─────────────────────────────────────────────────
// Data Fetching
// ─────────────────────────────────────────────────
async function loadData() {
  try {
    const [facRes, statsRes, compRes] = await Promise.all([
      fetch(`${API_BASE}/facilities`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/facilities/stats`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/complaints`).then(r => r.json()).catch(() => null)
    ]);

    if (facRes && facRes.success) {
      state.facilities = facRes.data;
      setConnectionStatus('PostgreSQL Connected');
    } else {
      state.facilities = fallbackData.facilities;
      setConnectionStatus('Local Mode (API offline)');
    }

    if (statsRes && statsRes.success) {
      state.metrics = statsRes.data;
    } else {
      recalculateMetrics();
    }

    if (compRes && compRes.success) {
      state.complaints = compRes.data;
    } else {
      state.complaints = fallbackData.complaints;
    }
  } catch {
    state.facilities = fallbackData.facilities;
    state.complaints = fallbackData.complaints;
    recalculateMetrics();
    setConnectionStatus('Local Mode (API offline)');
  }

  renderMetrics();
  renderDashboardTable();
  renderFacilitiesTable();
  renderComplaintsTable();
  populateDropdowns();
}

function setConnectionStatus(text) {
  document.getElementById('dbConnectionStatus').textContent = text;
}

// ─────────────────────────────────────────────────
// Metrics
// ─────────────────────────────────────────────────
function recalculateMetrics() {
  const facs = state.facilities;
  const total = facs.length;
  const avgClean = total > 0
    ? (facs.reduce((s, f) => s + parseFloat(f.cleanliness_score), 0) / total).toFixed(1)
    : 0;
  const critical = facs.filter(f => f.status === 'Critical').length;
  const activeComp = state.complaints.filter(c => c.status !== 'Resolved').length;

  state.metrics = {
    total_facilities: total,
    average_cleanliness: avgClean,
    critical_facilities: critical,
    active_complaints: activeComp
  };
}

function renderMetrics() {
  const m = state.metrics;
  document.getElementById('metricTotalFacilities').textContent = m.total_facilities ?? 0;
  document.getElementById('metricAvgCleanliness').textContent =
    (m.average_cleanliness ?? m.avg_cleanliness ?? '—') + '/10';
  document.getElementById('metricCritical').textContent = m.critical_facilities ?? 0;
  document.getElementById('metricActiveComplaints').textContent =
    m.active_complaints ?? state.complaints.filter(c => c.status !== 'Resolved').length;
}

// ─────────────────────────────────────────────────
// Dashboard Table
// ─────────────────────────────────────────────────
function renderDashboardTable() {
  const tbody = document.getElementById('dashboardQuickSummary');
  if (!tbody || state.facilities.length === 0) return;
  tbody.innerHTML = state.facilities.map(f => `
    <tr>
      <td><strong>${escHtml(f.name)}</strong></td>
      <td>${parseFloat(f.cleanliness_score).toFixed(1)}/10</td>
      <td>${parseFloat(f.odor_score).toFixed(1)}/10</td>
      <td>${statusBadge(f.status)}</td>
    </tr>
  `).join('');
}

// ─────────────────────────────────────────────────
// Facilities Table
// ─────────────────────────────────────────────────
function renderFacilitiesTable() {
  const tbody = document.getElementById('facilitiesTableBody');
  if (!tbody) return;

  if (state.facilities.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:24px;">No facilities found.</td></tr>';
    return;
  }

  tbody.innerHTML = state.facilities.map(f => `
    <tr>
      <td>
        <strong>${escHtml(f.name)}</strong><br>
        <span style="font-size:12px;color:#64748b;">${escHtml(f.location)}</span>
      </td>
      <td>${parseFloat(f.cleanliness_score).toFixed(1)}/10</td>
      <td>${parseFloat(f.odor_score).toFixed(1)}/10</td>
      <td>${escHtml(f.waste_level)}</td>
      <td>${f.footfall.toLocaleString()}</td>
      <td>${statusBadge(f.status)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="quickAudit(${f.id})">Log Inspection</button>
      </td>
    </tr>
  `).join('');
}

// ─────────────────────────────────────────────────
// Complaints Table
// ─────────────────────────────────────────────────
function renderComplaintsTable() {
  const tbody = document.getElementById('complaintsTableBody');
  if (!tbody) return;

  const active = state.complaints.filter(c => c.status !== 'Resolved');
  if (active.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:24px;">No open complaints.</td></tr>';
    return;
  }

  tbody.innerHTML = active.map(c => `
    <tr>
      <td>${escHtml(c.facility_name || `Zone #${c.facility_id}`)}</td>
      <td>${escHtml(c.complaint_title)}</td>
      <td>${priorityBadge(c.priority)}</td>
      <td>${escHtml(c.status)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="resolveTicket(${c.id})">Resolve</button>
      </td>
    </tr>
  `).join('');
}

// ─────────────────────────────────────────────────
// Populate Dropdowns
// ─────────────────────────────────────────────────
function populateDropdowns() {
  const options = state.facilities.map(f => `<option value="${f.id}">${escHtml(f.name)}</option>`).join('');
  const auditSelect = document.getElementById('auditFacilitySelect');
  const compSelect = document.getElementById('complaintFacilitySelect');
  if (auditSelect) auditSelect.innerHTML = options;
  if (compSelect) compSelect.innerHTML = options;
}

// ─────────────────────────────────────────────────
// Quick Audit from Facilities Table
// ─────────────────────────────────────────────────
window.quickAudit = function(facilityId) {
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  document.getElementById('navAudit').classList.add('active');
  document.getElementById('tabAudit').classList.add('active');

  const select = document.getElementById('auditFacilitySelect');
  if (select) select.value = facilityId;
};

// ─────────────────────────────────────────────────
// Resolve Complaint
// ─────────────────────────────────────────────────
window.resolveTicket = async function(id) {
  try {
    await fetch(`${API_BASE}/complaints/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved' })
    });
  } catch { /* fallback gracefully */ }

  const complaint = state.complaints.find(c => c.id === id);
  if (complaint) complaint.status = 'Resolved';

  recalculateMetrics();
  renderMetrics();
  renderComplaintsTable();
};

// ─────────────────────────────────────────────────
// Audit Form
// ─────────────────────────────────────────────────
function setupAuditForm() {
  const form = document.getElementById('auditForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const facilityId   = Number(document.getElementById('auditFacilitySelect').value);
    const cleanScore   = Number(document.getElementById('auditCleanliness').value);
    const odorScore    = Number(document.getElementById('auditOdor').value);
    const wasteLevel   = document.getElementById('auditWaste').value;
    const waterValue   = document.getElementById('auditWater').value;
    const notes        = document.getElementById('auditNotes').value;

    if (!facilityId || isNaN(cleanScore) || isNaN(odorScore)) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      facility_id:        facilityId,
      cleanliness_score:  cleanScore,
      odor_score:         odorScore,
      waste_level:        wasteLevel,
      water_available:    waterValue === 'true',
      notes
    };

    try {
      await fetch(`${API_BASE}/inspections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch { /* backend offline; update local state only */ }

    // Update local state to reflect new scores
    const fac = state.facilities.find(f => f.id === facilityId);
    if (fac) {
      fac.cleanliness_score = cleanScore;
      fac.odor_score        = odorScore;
      fac.waste_level       = wasteLevel;
      fac.hours_since_cleaning = 0;
      if (cleanScore <= 3.5 || odorScore >= 8.0) fac.status = 'Critical';
      else if (cleanScore <= 6.5 || odorScore >= 5.0) fac.status = 'Needs Cleaning';
      else fac.status = 'Good';
    }

    recalculateMetrics();
    renderMetrics();
    renderDashboardTable();
    renderFacilitiesTable();

    alert('Inspection submitted successfully. Facility scores updated.');
    form.reset();
  });
}

// ─────────────────────────────────────────────────
// Complaint Form
// ─────────────────────────────────────────────────
function setupComplaintForm() {
  const form = document.getElementById('complaintForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const facilityId  = Number(document.getElementById('complaintFacilitySelect').value);
    const title       = document.getElementById('complaintTitle').value.trim();
    const priority    = document.getElementById('complaintPriority').value;
    const description = document.getElementById('complaintDesc').value.trim();

    if (!facilityId || !title || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = { facility_id: facilityId, complaint_title: title, priority, description };

    try {
      await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch { /* backend offline; update local state only */ }

    const fac = state.facilities.find(f => f.id === facilityId);
    state.complaints.unshift({
      id:              Date.now(),
      facility_id:     facilityId,
      complaint_title: title,
      priority,
      status:          'Pending',
      facility_name:   fac ? fac.name : `Zone #${facilityId}`
    });

    recalculateMetrics();
    renderMetrics();
    renderComplaintsTable();

    alert('Complaint ticket submitted successfully.');
    form.reset();
  });
}

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statusBadge(status) {
  const map = {
    'Good':              'badge-good',
    'Needs Cleaning':    'badge-warning',
    'Under Maintenance': 'badge-info',
    'Critical':          'badge-danger'
  };
  const cls = map[status] || 'badge-info';
  return `<span class="badge ${cls}">${escHtml(status)}</span>`;
}

function priorityBadge(priority) {
  const map = {
    'Low':    'badge-good',
    'Medium': 'badge-info',
    'High':   'badge-warning',
    'Urgent': 'badge-danger'
  };
  const cls = map[priority] || 'badge-info';
  return `<span class="badge ${cls}">${escHtml(priority)}</span>`;
}
