import { useEffect, useState } from "react";
import { AI_API_BASE_URL, aiApiRequest, apiRequest } from "./api";

const initialRegisterForm = {
  name: "",
  email: "",
  password: "",
  contactNumber: "",
  address: ""
};

const initialLoginForm = {
  email: "",
  password: ""
};

const initialDepartmentForm = {
  name: ""
};

const initialSubjectForm = {
  name: "",
  type: "THEORY",
  periodsPerWeek: 1
};

function App() {
  const [session, setSession] = useState(null);
  const [mode, setMode] = useState("register");
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [departmentForm, setDepartmentForm] = useState(initialDepartmentForm);
  const [subjectForm, setSubjectForm] = useState(initialSubjectForm);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [timetableResult, setTimetableResult] = useState(null);
  const [selectedPreviewDepartment, setSelectedPreviewDepartment] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [busyKey, setBusyKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!session) {
      return;
    }
    refreshDepartments();
  }, [session]);

  useEffect(() => {
    if (!selectedDepartmentId || !session) {
      setSubjects([]);
      return;
    }

    refreshSubjects(selectedDepartmentId);
  }, [selectedDepartmentId, subjectFilter, session]);

  useEffect(() => {
    if (!isPreviewOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewOpen]);

  async function refreshDepartments() {
    if (!session) {
      return;
    }

    try {
      setBusyKey("departments");
      setError("");
      const data = await apiRequest(
        `/api/institutes/${session.instituteId}/departments`,
        { token: session.token }
      );
      setDepartments(data);
      setSelectedDepartmentId((current) => {
        if (current && data.some((item) => item.id === current)) {
          return current;
        }
        return data[0]?.id ?? null;
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  }

  async function refreshSubjects(departmentId) {
    if (!session || !departmentId) {
      return;
    }

    const filterQuery =
      subjectFilter === "ALL" ? "" : `?type=${encodeURIComponent(subjectFilter)}`;

    try {
      setBusyKey("subjects");
      setError("");
      const data = await apiRequest(
        `/api/departments/${departmentId}/subjects${filterQuery}`,
        { token: session.token }
      );
      setSubjects(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    try {
      setBusyKey("register");
      setError("");
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(registerForm)
      });
      setSession(data);
      setSuccess("Institute account created. You can start onboarding now.");
      setRegisterForm(initialRegisterForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      setBusyKey("login");
      setError("");
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm)
      });
      setSession(data);
      setSuccess("Welcome back. Your setup data is ready.");
      setLoginForm(initialLoginForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  }

  async function handleDepartmentSubmit(event) {
    event.preventDefault();
    if (!session) {
      return;
    }

    try {
      setBusyKey("save-department");
      setError("");
      await apiRequest(`/api/institutes/${session.instituteId}/departments`, {
        method: "POST",
        token: session.token,
        body: JSON.stringify(departmentForm)
      });
      setDepartmentForm(initialDepartmentForm);
      setSuccess("Department added successfully.");
      await refreshDepartments();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  }

  async function handleDeleteDepartment(departmentId) {
    if (!session) {
      return;
    }

    try {
      setBusyKey(`delete-department-${departmentId}`);
      setError("");
      await apiRequest(
        `/api/institutes/${session.instituteId}/departments/${departmentId}`,
        { method: "DELETE", token: session.token }
      );
      setSuccess("Department removed.");
      if (selectedDepartmentId === departmentId) {
        setSelectedDepartmentId(null);
      }
      await refreshDepartments();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  }

  async function handleSubjectSubmit(event) {
    event.preventDefault();
    if (!session || !selectedDepartmentId) {
      return;
    }

    const path = editingSubjectId
      ? `/api/subjects/${editingSubjectId}`
      : `/api/departments/${selectedDepartmentId}/subjects`;
    const method = editingSubjectId ? "PUT" : "POST";

    try {
      setBusyKey("save-subject");
      setError("");
      await apiRequest(path, {
        method,
        token: session.token,
        body: JSON.stringify({
          ...subjectForm,
          periodsPerWeek: Number(subjectForm.periodsPerWeek)
        })
      });
      setSubjectForm(initialSubjectForm);
      setEditingSubjectId(null);
      setSuccess(editingSubjectId ? "Subject updated." : "Subject added.");
      await refreshSubjects(selectedDepartmentId);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  }

  async function handleDeleteSubject(subjectId) {
    if (!session || !selectedDepartmentId) {
      return;
    }

    try {
      setBusyKey(`delete-subject-${subjectId}`);
      setError("");
      await apiRequest(`/api/subjects/${subjectId}`, {
        method: "DELETE",
        token: session.token
      });
      setSuccess("Subject removed.");
      if (editingSubjectId === subjectId) {
        setEditingSubjectId(null);
        setSubjectForm(initialSubjectForm);
      }
      await refreshSubjects(selectedDepartmentId);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  }

  function startEditingSubject(subject) {
    setEditingSubjectId(subject.id);
    setSubjectForm({
      name: subject.name,
      type: subject.type,
      periodsPerWeek: subject.periodsPerWeek
    });
    setSuccess("");
    setError("");
  }

  function logout() {
    setSession(null);
    setDepartments([]);
    setSubjects([]);
    setSelectedDepartmentId(null);
    setEditingSubjectId(null);
    setSubjectForm(initialSubjectForm);
    setTimetableResult(null);
    setSelectedPreviewDepartment(null);
    setSuccess("Session cleared.");
    setError("");
  }

  async function buildGenerationPayload() {
    if (!session) {
      throw new Error("Please sign in first.");
    }

    const departmentList = await apiRequest(
      `/api/institutes/${session.instituteId}/departments`,
      { token: session.token }
    );

    if (!departmentList.length) {
      throw new Error("Add at least one department before generating a timetable.");
    }

    const departmentsWithSubjects = [];

    for (const department of departmentList) {
      const subjectList = await apiRequest(`/api/departments/${department.id}/subjects`, {
        token: session.token
      });

      departmentsWithSubjects.push({
        id: department.id,
        name: department.name,
        subjects: subjectList.map((subject) => ({
          id: subject.id,
          name: subject.name,
          type: subject.type,
          periodsPerWeek: subject.periodsPerWeek
        }))
      });
    }

    return {
      instituteId: session.instituteId,
      instituteName: session.name,
      departments: departmentsWithSubjects
    };
  }

  async function handleGenerateTimetable() {
    try {
      setBusyKey("generate-timetable");
      setError("");
      setSuccess("");
      const payload = await buildGenerationPayload();
      const data = await aiApiRequest("/api/timetables/generate", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setTimetableResult(data);
      setSelectedPreviewDepartment(data.departments[0]?.departmentName ?? null);
      setIsPreviewOpen(true);
      setSuccess("Timetable generated successfully. You can preview it or download the Excel file.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  }

  const selectedDepartment = departments.find(
    (department) => department.id === selectedDepartmentId
  );

  const previewDepartment =
    timetableResult?.departments.find(
      (department) => department.departmentName === selectedPreviewDepartment
    ) ?? timetableResult?.departments[0] ?? null;

  const stats = {
    departments: departments.length,
    totalSubjects: subjects.length,
    labs: subjects.filter((subject) => subject.type === "LAB").length,
    theory: subjects.filter((subject) => subject.type === "THEORY").length
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      {!session ? (
        <AuthView
          mode={mode}
          setMode={setMode}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          handleRegister={handleRegister}
          handleLogin={handleLogin}
          busyKey={busyKey}
          error={error}
          success={success}
        />
      ) : (
        <DashboardView
          session={session}
          logout={logout}
          stats={stats}
          departments={departments}
          departmentForm={departmentForm}
          setDepartmentForm={setDepartmentForm}
          handleDepartmentSubmit={handleDepartmentSubmit}
          handleDeleteDepartment={handleDeleteDepartment}
          selectedDepartmentId={selectedDepartmentId}
          setSelectedDepartmentId={setSelectedDepartmentId}
          selectedDepartment={selectedDepartment}
          subjects={subjects}
          subjectForm={subjectForm}
          setSubjectForm={setSubjectForm}
          handleSubjectSubmit={handleSubjectSubmit}
          handleDeleteSubject={handleDeleteSubject}
          startEditingSubject={startEditingSubject}
          editingSubjectId={editingSubjectId}
          setEditingSubjectId={setEditingSubjectId}
          setSubjectFormDirect={setSubjectForm}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          timetableResult={timetableResult}
          previewDepartment={previewDepartment}
          selectedPreviewDepartment={selectedPreviewDepartment}
          setSelectedPreviewDepartment={setSelectedPreviewDepartment}
          isPreviewOpen={isPreviewOpen}
          setIsPreviewOpen={setIsPreviewOpen}
          handleGenerateTimetable={handleGenerateTimetable}
          busyKey={busyKey}
          error={error}
          success={success}
        />
      )}
    </div>
  );
}

function AuthView({
  mode,
  setMode,
  registerForm,
  setRegisterForm,
  loginForm,
  setLoginForm,
  handleRegister,
  handleLogin,
  busyKey,
  error,
  success
}) {
  return (
    <main className="auth-layout">
      <section className="hero-panel card">
        <div className="eyebrow">Automated Class Scheduler</div>
        <h1>Turn institute setup into a clean, guided workflow.</h1>
        <p className="lead">
          Register an institute, organize departments, feed theory and lab
          subjects, and keep everything ready for your future Python timetable
          engine.
        </p>

        <div className="hero-grid">
          <FeatureTile
            title="Fast institute onboarding"
            text="Capture all the structure your scheduler will need before generation begins."
          />
          <FeatureTile
            title="Subject-aware planning"
            text="Track theory and lab subjects separately, including weekly period counts."
          />
          <FeatureTile
            title="Ready for AI service"
            text="Generate department-wise timetables, preview them clearly, and download them in Excel format."
          />
        </div>
      </section>

      <section className="auth-panel card">
        <div className="tab-row">
          <button
            className={mode === "register" ? "tab active" : "tab"}
            onClick={() => setMode("register")}
            type="button"
          >
            Create Account
          </button>
          <button
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => setMode("login")}
            type="button"
          >
            Sign In
          </button>
        </div>

        {error ? <Banner tone="error" text={error} /> : null}
        {success ? <Banner tone="success" text={success} /> : null}

        {mode === "register" ? (
          <form className="form-stack" onSubmit={handleRegister}>
            <Input
              label="Institute Name"
              value={registerForm.name}
              onChange={(value) =>
                setRegisterForm((current) => ({ ...current, name: value }))
              }
              placeholder="ABC Institute of Engineering"
            />
            <Input
              label="Email"
              type="email"
              value={registerForm.email}
              onChange={(value) =>
                setRegisterForm((current) => ({ ...current, email: value }))
              }
              placeholder="admin@abc.edu"
            />
            <Input
              label="Password"
              type="password"
              value={registerForm.password}
              onChange={(value) =>
                setRegisterForm((current) => ({ ...current, password: value }))
              }
              placeholder="At least 6 characters"
            />
            <div className="split-inputs">
              <Input
                label="Contact Number"
                value={registerForm.contactNumber}
                onChange={(value) =>
                  setRegisterForm((current) => ({
                    ...current,
                    contactNumber: value
                  }))
                }
                placeholder="+91 ..."
                required={false}
              />
              <Input
                label="Address"
                value={registerForm.address}
                onChange={(value) =>
                  setRegisterForm((current) => ({ ...current, address: value }))
                }
                placeholder="Campus address"
                required={false}
              />
            </div>

            <button className="primary-button" disabled={busyKey === "register"}>
              {busyKey === "register" ? "Creating..." : "Create Institute Account"}
            </button>
          </form>
        ) : (
          <form className="form-stack" onSubmit={handleLogin}>
            <Input
              label="Email"
              type="email"
              value={loginForm.email}
              onChange={(value) =>
                setLoginForm((current) => ({ ...current, email: value }))
              }
              placeholder="admin@abc.edu"
            />
            <Input
              label="Password"
              type="password"
              value={loginForm.password}
              onChange={(value) =>
                setLoginForm((current) => ({ ...current, password: value }))
              }
              placeholder="Your password"
            />
            <button className="primary-button" disabled={busyKey === "login"}>
              {busyKey === "login" ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function DashboardView({
  session,
  logout,
  stats,
  departments,
  departmentForm,
  setDepartmentForm,
  handleDepartmentSubmit,
  handleDeleteDepartment,
  selectedDepartmentId,
  setSelectedDepartmentId,
  selectedDepartment,
  subjects,
  subjectForm,
  setSubjectForm,
  handleSubjectSubmit,
  handleDeleteSubject,
  startEditingSubject,
  editingSubjectId,
  setEditingSubjectId,
  setSubjectFormDirect,
  subjectFilter,
  setSubjectFilter,
  timetableResult,
  previewDepartment,
  selectedPreviewDepartment,
  setSelectedPreviewDepartment,
  isPreviewOpen,
  setIsPreviewOpen,
  handleGenerateTimetable,
  busyKey,
  error,
  success
}) {
  return (
    <main className="dashboard-layout">
      <header className="topbar card">
        <div>
          <div className="eyebrow">Institute Workspace</div>
          <h2>{session.name}</h2>
          <p>{session.email}</p>
        </div>

        <div className="topbar-actions">
          <button className="ghost-button" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {error ? <Banner tone="error" text={error} /> : null}
      {success ? <Banner tone="success" text={success} /> : null}

      <section className="stats-row">
        <StatCard label="Departments" value={stats.departments} />
        <StatCard label="Visible Subjects" value={stats.totalSubjects} />
        <StatCard label="Theory" value={stats.theory} />
        <StatCard label="Labs" value={stats.labs} />
      </section>

      <section className="workspace-grid">
        <section className="panel-column">
          <section className="card section-card">
            <div className="section-head">
              <div>
                <div className="eyebrow">Step 1</div>
                <h3>Departments</h3>
              </div>
              <span className="status-dot">
                {busyKey === "departments" ? "Refreshing..." : "Synced"}
              </span>
            </div>

            <form className="compact-form" onSubmit={handleDepartmentSubmit}>
              <Input
                label="New Department"
                value={departmentForm.name}
                onChange={(value) =>
                  setDepartmentForm((current) => ({ ...current, name: value }))
                }
                placeholder="CSE, IT, ECE..."
              />
              <button
                className="primary-button"
                disabled={busyKey === "save-department"}
              >
                {busyKey === "save-department" ? "Saving..." : "Add Department"}
              </button>
            </form>

            <div className="list-stack">
              {departments.length ? (
                departments.map((department) => (
                  <div
                    key={department.id}
                    className={
                      department.id === selectedDepartmentId
                        ? "list-item selected"
                        : "list-item"
                    }
                  >
                    <button
                      className="list-main"
                      type="button"
                      onClick={() => setSelectedDepartmentId(department.id)}
                    >
                      <span>{department.name}</span>
                      <small>ID {department.id}</small>
                    </button>
                    <button
                      className="icon-button"
                      type="button"
                      disabled={busyKey === `delete-department-${department.id}`}
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No departments yet"
                  text="Create your first department to begin organizing subjects."
                />
              )}
            </div>
          </section>

          <section className="card section-card accent-card">
            <div className="section-head">
              <div>
                <div className="eyebrow">Step 3</div>
                <h3>AI Timetable Hand-off</h3>
              </div>
            </div>
            <p className="muted-text">
              Generate polished weekly timetables for your departments, preview
              them instantly, and download the final Excel file when ready.
            </p>
            <div className="button-row">
              <button
                className="primary-button"
                type="button"
                disabled={busyKey === "generate-timetable"}
                onClick={handleGenerateTimetable}
              >
                {busyKey === "generate-timetable"
                  ? "Generating..."
                  : "Generate Timetable"}
              </button>
              {timetableResult ? (
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  Open Preview
                </button>
              ) : null}
              {timetableResult ? (
                <a
                  className="ghost-button link-button"
                  href={`${AI_API_BASE_URL}${timetableResult.excelDownloadUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Excel
                </a>
              ) : null}
            </div>
            {timetableResult ? (
              <div className="generation-meta">
                <span>
                  Ready for {timetableResult.departments.length} department
                  {timetableResult.departments.length > 1 ? "s" : ""}
                </span>
              </div>
            ) : null}
          </section>
        </section>

        <section className="panel-column wide">
          <section className="card section-card">
            <div className="section-head">
              <div>
                <div className="eyebrow">Step 2</div>
                <h3>
                  Subjects
                  {selectedDepartment ? ` for ${selectedDepartment.name}` : ""}
                </h3>
              </div>
              <div className="filter-row">
                <button
                  className={subjectFilter === "ALL" ? "chip active" : "chip"}
                  type="button"
                  onClick={() => setSubjectFilter("ALL")}
                >
                  All
                </button>
                <button
                  className={subjectFilter === "THEORY" ? "chip active" : "chip"}
                  type="button"
                  onClick={() => setSubjectFilter("THEORY")}
                >
                  Theory
                </button>
                <button
                  className={subjectFilter === "LAB" ? "chip active" : "chip"}
                  type="button"
                  onClick={() => setSubjectFilter("LAB")}
                >
                  Lab
                </button>
              </div>
            </div>

            {selectedDepartment ? (
              <>
                <form className="subject-form-grid" onSubmit={handleSubjectSubmit}>
                  <Input
                    label="Subject Name"
                    value={subjectForm.name}
                    onChange={(value) =>
                      setSubjectForm((current) => ({ ...current, name: value }))
                    }
                    placeholder="DBMS, OS Lab..."
                  />
                  <Select
                    label="Subject Type"
                    value={subjectForm.type}
                    onChange={(value) =>
                      setSubjectForm((current) => ({ ...current, type: value }))
                    }
                    options={[
                      { label: "Theory", value: "THEORY" },
                      { label: "Lab", value: "LAB" }
                    ]}
                  />
                  <Input
                    label="Periods Per Week"
                    type="number"
                    min="1"
                    value={subjectForm.periodsPerWeek}
                    onChange={(value) =>
                      setSubjectForm((current) => ({
                        ...current,
                        periodsPerWeek: value
                      }))
                    }
                    placeholder="1"
                  />
                  <div className="button-row">
                    <button
                      className="primary-button"
                      disabled={busyKey === "save-subject"}
                    >
                      {busyKey === "save-subject"
                        ? "Saving..."
                        : editingSubjectId
                          ? "Update Subject"
                          : "Add Subject"}
                    </button>
                    {editingSubjectId ? (
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() => {
                          setEditingSubjectId(null);
                          setSubjectFormDirect(initialSubjectForm);
                        }}
                      >
                        Cancel Edit
                      </button>
                    ) : null}
                  </div>
                </form>

                <div className="subject-list">
                  {subjects.length ? (
                    subjects.map((subject) => (
                      <article key={subject.id} className="subject-card">
                        <div className="subject-top">
                          <div>
                            <div className="subject-title">{subject.name}</div>
                            <div className="subject-meta">
                              <span className="badge">{subject.type}</span>
                              <span>{subject.periodsPerWeek} / week</span>
                              <span>
                                Duration {subject.periodDuration} period
                                {subject.periodDuration > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                          <div className="subject-actions">
                            <button
                              className="ghost-button"
                              type="button"
                              onClick={() => startEditingSubject(subject)}
                            >
                              Edit
                            </button>
                            <button
                              className="ghost-button danger"
                              type="button"
                              disabled={busyKey === `delete-subject-${subject.id}`}
                              onClick={() => handleDeleteSubject(subject.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <EmptyState
                      title="No subjects in this view"
                      text="Add theory or lab subjects for the selected department."
                    />
                  )}
                </div>
              </>
            ) : (
              <EmptyState
                title="Pick a department first"
                text="Subject setup becomes available once at least one department exists."
              />
            )}
          </section>

          <section className="card section-card">
            <div className="section-head">
              <div>
                <div className="eyebrow">Preview</div>
                <h3>Generated Timetable</h3>
              </div>
            </div>

            {timetableResult && previewDepartment ? (
              <div className="preview-launcher">
                <div className="preview-summary">
                  <span>Total subjects: {previewDepartment.summary.totalSubjects}</span>
                  <span>Theory: {previewDepartment.summary.theorySubjects}</span>
                  <span>Labs: {previewDepartment.summary.labSubjects}</span>
                  <span>Free periods: {previewDepartment.summary.freePeriods}</span>
                </div>
                <p className="muted-text preview-launcher-copy">
                  Open the timetable in a popup window for a larger, easier-to-read
                  preview.
                </p>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  View Timetable Preview
                </button>
              </div>
            ) : (
              <EmptyState
                title="No generated timetable yet"
                text="Use the generator panel to build a timetable preview and download the Excel file."
              />
            )}
          </section>
        </section>
      </section>

      {isPreviewOpen && timetableResult && previewDepartment ? (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={() => setIsPreviewOpen(false)}
        >
          <section
            className="modal-card card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="timetable-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <div className="eyebrow">Popup Preview</div>
                <h3 id="timetable-preview-title">Generated Timetable</h3>
              </div>
              <button
                className="icon-button modal-close"
                type="button"
                aria-label="Close timetable preview"
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </button>
            </div>

            <TimetablePreviewContent
              timetableResult={timetableResult}
              previewDepartment={previewDepartment}
              selectedPreviewDepartment={selectedPreviewDepartment}
              setSelectedPreviewDepartment={setSelectedPreviewDepartment}
            />
          </section>
        </div>
      ) : null}
    </main>
  );
}

function TimetablePreviewContent({
  timetableResult,
  previewDepartment,
  selectedPreviewDepartment,
  setSelectedPreviewDepartment
}) {
  return (
    <>
      <div className="preview-tabs">
        {timetableResult.departments.map((department) => (
          <button
            key={department.departmentName}
            className={
              selectedPreviewDepartment === department.departmentName
                ? "chip active"
                : "chip"
            }
            type="button"
            onClick={() => setSelectedPreviewDepartment(department.departmentName)}
          >
            {department.departmentName}
          </button>
        ))}
      </div>

      <div className="preview-summary">
        <span>Total subjects: {previewDepartment.summary.totalSubjects}</span>
        <span>Theory: {previewDepartment.summary.theorySubjects}</span>
        <span>Labs: {previewDepartment.summary.labSubjects}</span>
        <span>Free periods: {previewDepartment.summary.freePeriods}</span>
      </div>

      <div className="table-wrap">
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Time</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
            </tr>
          </thead>
          <tbody>
            {previewDepartment.slots.map((slot) => (
              <FragmentRow key={slot.slotCode} slot={slot} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function FragmentRow({ slot }) {
  return (
    <>
      <tr>
        <td>{slot.slotCode}</td>
        <td>{slot.time}</td>
        <td>{slot.entries.Monday}</td>
        <td>{slot.entries.Tuesday}</td>
        <td>{slot.entries.Wednesday}</td>
        <td>{slot.entries.Thursday}</td>
        <td>{slot.entries.Friday}</td>
      </tr>
      {slot.slotCode === "P4" ? (
        <tr className="lunch-row">
          <td colSpan="7">Lunch Break - 12:50 to 1:40 PM</td>
        </tr>
      ) : null}
    </>
  );
}

function Banner({ tone, text }) {
  return <div className={`banner ${tone}`}>{text}</div>;
}

function FeatureTile({ title, text }) {
  return (
    <article className="feature-tile">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="stat-card card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  required = true
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        min={min}
        required={required}
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default App;
