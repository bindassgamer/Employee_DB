import { useEffect, useMemo, useState } from "react";
import api, { API_BASE } from "./api.js";
import idmsLogo from "./assets/icons/idms_logo.svg";
import userAvatar from "./assets/icons/user_avatar.svg";
import searchIcon from "./assets/icons/search_icon.svg";
import createIcon from "./assets/icons/create.svg";
import noRecordsIcon from "./assets/icons/no_records.svg";
import actionIcon from "./assets/icons/action.svg";
import photoIcon from "./assets/icons/photo.svg";
import employeeIcon from "./assets/icons/employee.svg";
import leavesIcon from "./assets/icons/leaves.svg";
import holidaysIcon from "./assets/icons/holidays.svg";
import outdoorDutyIcon from "./assets/icons/outdoor_duty.svg";
import expenseIcon from "./assets/icons/expense.svg";
import attendanceIcon from "./assets/icons/attendance.svg";
import itComputationIcon from "./assets/icons/it_computation.svg";
import salaryIcon from "./assets/icons/salary.svg";
import documentsIcon from "./assets/icons/documents.svg";
import trainingIcon from "./assets/icons/training.svg";
import performanceIcon from "./assets/icons/performance.svg";
import policiesIcon from "./assets/icons/policies.svg";
import reportsIcon from "./assets/icons/reports.svg";
import supportIcon from "./assets/icons/support.svg";

const sidebarItems = [
  { label: "Employee", icon: employeeIcon },
  { label: "Leaves", icon: leavesIcon },
  { label: "Holidays", icon: holidaysIcon },
  { label: "Outdoor Duty", icon: outdoorDutyIcon },
  { label: "Expense", icon: expenseIcon },
  { label: "Attendance", icon: attendanceIcon },
  { label: "IT Computation", icon: itComputationIcon },
  { label: "Salary", icon: salaryIcon },
  { label: "Documents", icon: documentsIcon },
  { label: "Training & Dev.", icon: trainingIcon },
  { label: "Performance", icon: performanceIcon },
  { label: "HR Policies", icon: policiesIcon },
  { label: "Reports", icon: reportsIcon },
  { label: "Support", icon: supportIcon },
];

const defaultEmployeeForm = {
  fullName: "",
  dateOfBirth: "",
  email: "",
  department: "",
  phoneNumber: "",
  designation: "",
  gender: "",
  photo: null,
};

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\d{10}$/;

const buildQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  const str = query.toString();
  return str ? `?${str}` : "";
};

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        <img src={noRecordsIcon} alt="" />
      </div>
      <p>No Records to be displayed</p>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [meta, setMeta] = useState({
    departments: [],
    designations: [],
    genders: [],
  });
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    designation: "",
    gender: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState(defaultEmployeeForm);
  const [formError, setFormError] = useState("");

  const queryString = useMemo(() => buildQuery(filters), [filters]);

  const fetchMeta = async () => {
    try {
      const data = await api.fetchMeta();
     
      setMeta(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.fetchEmployees(queryString);
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMeta();
      fetchEmployees();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchEmployees();
    }
  }, [queryString, token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    try {
      const data = await api.login(loginForm);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setLoginForm({ identifier: "", password: "" });
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setEmployees([]);
  };

  const handleCreateEmployee = async (event) => {
    event.preventDefault();
    setFormError("");

    const {
      fullName,
      dateOfBirth,
      email,
      department,
      phoneNumber,
      designation,
      gender,
      photo,
    } = employeeForm;

    if (
      !fullName ||
      !dateOfBirth ||
      !email ||
      !department ||
      !phoneNumber ||
      !designation ||
      !gender ||
      !photo
    ) {
      setFormError("All fields are required");
      return;
    }

    if (!emailRegex.test(email)) {
      setFormError("Invalid email format");
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      setFormError("Phone number must be exactly 10 digits");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("email", email);
    formData.append("department", department);
    formData.append("phoneNumber", phoneNumber);
    formData.append("designation", designation);
    formData.append("gender", gender);
    formData.append("photo", photo);

    try {
      await api.createEmployee(formData);
      setIsModalOpen(false);
      setEmployeeForm(defaultEmployeeForm);
      fetchEmployees();
    } catch (err) {
      setFormError(err.message);
    }
  };

  if (!token) {
    return (
      <div className="login-shell">
        <div className="login-wave" aria-hidden="true" />
        <section className="login-card">
          <div className="brand-lockup">
            <img src={idmsLogo} alt="IDMS" className="brand-logo" />
            <p>People platform</p>
          </div>
          <h2>Login</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <label className="field">
              <span>Email</span>
              <input
                type="text"
                placeholder="Enter email"
                value={loginForm.identifier}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, identifier: e.target.value })
                }
                required
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                required
              />
            </label>
            {loginError ? <p className="inline-error">{loginError}</p> : null}
            <button type="submit" className="primary-cta">
              Login
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          <img src={idmsLogo} alt="IDMS" />
        </div>
        <nav>
          {sidebarItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={`side-item ${index === 0 ? "active" : ""}`}
            >
              <img src={item.icon} alt="" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <h1>Employee Setup</h1>
          <button className="profile-btn" onClick={handleLogout} title="Logout">
            <img src={userAvatar} alt="User" />
          </button>
        </header>

        <div className="toolbar">
          <div className="search-wrap">
            <img src={searchIcon} alt="" className="search-icon" />
            <input
              type="search"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <button className="create-btn" onClick={() => setIsModalOpen(true)}>
            <img src={createIcon} alt="" />
          </button>
        </div>

        <main className="table-card">
          {loading ? (
            <div className="loading">Loading employees...</div>
          ) : employees.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="table-wrap">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Photo</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.fullName}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phoneNumber}</td>
                      <td>{emp.gender}</td>
                      <td>{new Date(emp.dateOfBirth).toLocaleDateString()}</td>
                      <td>{emp.department}</td>
                      <td>{emp.designation}</td>
                      <td>
                        <a
                          className="photo-link"
                          href={`${API_BASE}${emp.photoPath}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img src={photoIcon} alt="" />
                        </a>
                      </td>
                      <td>
                        <button className="action-dots" type="button">
                          <img src={actionIcon} alt="Action" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {error ? <p className="inline-error">{error}</p> : null}
        </main>

        <footer className="table-footer">
          <div>Total Records -&gt; {employees.length}</div>
          <div className="pagination">
            <button type="button">{"<-"}</button>
            <span>Page 1</span>
            <button type="button">{"->"}</button>
          </div>
        </footer>
      </section>

      {isModalOpen ? (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <section className="create-modal" onClick={(e) => e.stopPropagation()}>
            <header>
              <h2>Create Employee</h2>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </header>
            <form className="modal-grid" onSubmit={handleCreateEmployee}>
              <label className="field">
                <span>Full Name *</span>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={employeeForm.fullName}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      fullName: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label className="field">
                <span>Email *</span>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={employeeForm.email}
                  onChange={(e) =>
                    setEmployeeForm({ ...employeeForm, email: e.target.value })
                  }
                  required
                />
              </label>
              <label className="field">
                <span>Contact *</span>
                <input
                  type="tel"
                  placeholder="Enter contact"
                  value={employeeForm.phoneNumber}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label className="field">
                <span>Gender *</span>
                <select
                  className="icon-select"
                  value={employeeForm.gender}
                  onChange={(e) =>
                    setEmployeeForm({ ...employeeForm, gender: e.target.value })
                  }
                  required
                >
                  <option value="">Select</option>
                  {meta.genders.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Date of Birth *</span>
                <input
                  className="date-input"
                  type="date"
                  value={employeeForm.dateOfBirth}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      dateOfBirth: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label className="field">
                <span>Department *</span>
                <select
                  className="icon-select"
                  value={employeeForm.department}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      department: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select</option>
                  {meta.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Designation *</span>
                <select
                  className="icon-select"
                  value={employeeForm.designation}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      designation: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select</option>
                  {meta.designations.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Employee Photo *</span>
                <input
                  className="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      photo: e.target.files?.[0] ?? null,
                    })
                  }
                  required
                />
              </label>
              {formError ? <p className="inline-error">{formError}</p> : null}
              <div className="modal-actions">
                <button className="save-btn" type="submit">
                  Save
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
