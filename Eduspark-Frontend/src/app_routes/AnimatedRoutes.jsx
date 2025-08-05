import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Loading from '../components/loading_ui/Loading';
import PageWrapper from '../PageWrapper';

// 🔐 Route Guards
import ProtectedAdminRoute from './protected_routes/admin/ProtectedAdminRoute';
import ProtectedTeacherRoute from './protected_routes/teacher/ProtectedTeacherRoute';
import ProtectedStudentRoute from './protected_routes/student/ProtectedStudentRoute';
import ProtectedParentRoute from './protected_routes/parent/ProtectedParentRoute';

// ✅ Eager-loaded pages
import Home from '../common_pages/main_home_page/Home';
import LoginPage from '../common_pages/common_login/LoginPage';
import CreateAdminAccountPage from '../common_pages/create_adminAccount/CreateAdminAccountPage';
import CreateParentAccountPage from '../common_pages/create_parentAccount/CreateParentAccountPage';
import ParentEntryHomePage from '../common_pages/parent_dashboard/ParentEntryHomePage';
import ParentHomePage from '../common_pages/parent_dashboard/ParentHomePage';
import HomeworkArchivePage from '../common_pages/teacher_dashboard/HomeworkListPage';



// ✅ Lazy-loaded pages
const HomeworkListPage = lazy(() => import('../common_pages/teacher_dashboard/HomeworkListPage'));
const VerifiedSubmittedHomeworkPage = lazy(() => import('../common_pages/student_dashboard/VerifiedSubmittedHomeworkPage'));
const StudentFeesHistoryPage = lazy(() => import('../common_pages/student_dashboard/StudentFeesHistoryPage'));
const StudentProgressReportPage = lazy(() => import('../common_pages/student_dashboard/StudentProgressReportPage'));
const StudentHome = lazy(() => import('../common_pages/student_dashboard/StudentHome'));
const StudentTimetablePage = lazy(() => import('../common_pages/student_dashboard/StudentTimetablePage'));
const StudentTeacherListPage = lazy(() => import('../common_pages/student_dashboard/StudentTeacherListPage'));
const SchoolMessagePage = lazy(() => import('../common_pages/student_dashboard/SchoolMessagePage'));
const StudentHomeworkPage = lazy(() => import('../common_pages/student_dashboard/StudentHomeworkPage'));
const AdminProfileViewPage = lazy(() => import('../common_pages/admin_dashboard/AdminProfileViewPage'));
const ForgotPasswordPage = lazy(() => import('../common_pages/forgotCredentials/ForgotPasswordPage'));
const ForgotUdisecodePage = lazy(() => import('../common_pages/forgotCredentials/ForgotUdisecodePage'));
const UserEntryHomePage = lazy(() => import('../common_pages/main_home_page/UserEntryHomePage'));
const AlertMessage = lazy(() => import('../common_pages/alert_Message/AlertMessagePage'));
const EditTeacherProfile = lazy(() => import('../common_pages/admin_dashboard/EditTeacherProfile'));
const AttendanceDashboardAdmin = lazy(() => import('../common_pages/admin_dashboard/AttendanceDashboardPageAdmin'));
const AttendanceHistoryAdmin = lazy(() => import('../common_pages/admin_dashboard/AttendanceHistoryPageadmin'));
const StudentAttendanceAdmin = lazy(() => import('../common_pages/admin_dashboard/AttendancePageAdmin'));
const TeacherDetails = lazy(() => import('../components/teacher_layout/teacher_navbar/TeacherDetails'));
const FullStudentInfo = lazy(() => import('../common_pages/teacher_dashboard/FullStudentInfo'));
const OTPVerify = lazy(() => import('../components/common_authentication/OTPVerify'));
const AdminHome = lazy(() => import('../common_pages/admin_dashboard/AdminHome'));
const TeacherSignup = lazy(() => import('../common_pages/admin_dashboard/TeacherSignup'));
const TeachersList = lazy(() => import('../common_pages/admin_dashboard/TeachersList'));
const StudentSignup = lazy(() => import('../common_pages/admin_dashboard/StudentSignup'));
const StudentList = lazy(() => import('../common_pages/admin_dashboard/StudentList'));
const StudentProfilePage = lazy(() => import('../common_pages/admin_dashboard/StudentProfilePage'));
const ClassDivisionConfig = lazy(() => import('../common_pages/admin_dashboard/ClassDivisionConfig'));
const ClassManagment = lazy(() => import('../common_pages/admin_dashboard/ClassManagment'));
const ManageSubjects = lazy(() => import('../common_pages/admin_dashboard/ManageSubjects'));
const AddExamMarkAdmin = lazy(() => import('../common_pages/admin_dashboard/AddExamMarkAdmin'));
const AddExamMarkTeacher = lazy(() => import('../common_pages/teacher_dashboard/AddExamMarkTeacher'));
const ConfigFeesStructure = lazy(() => import('../common_pages/admin_dashboard/ConfigFeesStructure'));
const StudentFeeManager = lazy(() => import('../common_pages/admin_dashboard/StudentFeeManager'));
const FeeManagmentOption = lazy(() => import('../common_pages/admin_dashboard/FeeManagmentOption'));
const OptionFeeMange = lazy(() => import('../components/admin_layout/fees_management/Option_feeMange/OptionFeeMange'));
const CreateTimetablePage = lazy(() => import('../common_pages/admin_dashboard/CreateTimetablePage'));
const AllClassTimetablePage = lazy(() => import('../common_pages/admin_dashboard/AllClassTimetablePage'));
const AllClassTimetable = lazy(() => import('../components/admin_layout/Timetable_Management/AllClassTimetable'));
const OptionTwoCardPage = lazy(() => import('../common_pages/admin_dashboard/OptionTwoCardPage'));
const StudentFeesHistory = lazy(() => import('../common_pages/admin_dashboard/StudentFeesHistory'));
const PaymentHistory = lazy(() => import('../components/admin_layout/fees_management/fees_records/PaymentHistory'));
const AttendancePage = lazy(() => import('../common_pages/teacher_dashboard/AttendancePage'));
const TeacherAccessConfigPage = lazy(() => import('../common_pages/admin_dashboard/TeacherAccessConfigPage'));
const TeacherHomePage = lazy(() => import('../common_pages/teacher_dashboard/HomePage'));
const TeacherTodaySchedule = lazy(() => import('../common_pages/teacher_dashboard/TeacherTodaySchedule'));
const AttendanceDashboardPage = lazy(() => import('../common_pages/teacher_dashboard/AttendanceDashboardPage'));
const AttendanceHistoryPage = lazy(() => import('../common_pages/teacher_dashboard/AttendanceHistoryPage'));
const ClassStudentListPage = lazy(() => import('../common_pages/teacher_dashboard/ClassStudentListPage'));
const StudentProfileCardPage = lazy(() => import('../common_pages/teacher_dashboard/StudentProfileCardPage'));
const ClasswiseTimetableViewerPage = lazy(() => import('../common_pages/teacher_dashboard/ClasswiseTimetableViewerPage'));
const AssignHomeworkPage = lazy(() => import('../common_pages/teacher_dashboard/AssignHomeworkPage'));
const HomeworkDetailPage = lazy(() => import('../components/teacher_layout/homework/HomeworkDetailPage'));
const SchoolAnnouncementsPage = lazy(() => import('../common_pages/admin_dashboard/SchoolAnnouncementsPage'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="text-center font-semibold mt-10"><Loading /></div>}>
          <PageWrapper>
            <Routes location={location} key={location.pathname}>

              {/* 🌐 Public Routes */}
              <Route path="/" element={<UserEntryHomePage />} />
              <Route path="/role-selector" element={<Home />} />
              <Route path="/login/:role" element={<LoginPage />} />
              <Route path="/:role/otp-verify" element={<OTPVerify />} />
              <Route path="/parent/signup" element={<CreateParentAccountPage />} />
              <Route path="/school-alerts/:role" element={<AlertMessage />} />
              <Route path="/admin/create-account" element={<CreateAdminAccountPage />} />
              <Route path="/forgot-udisecode" element={<ForgotUdisecodePage />} />
              <Route path="/forgot-password/:role" element={<ForgotPasswordPage />} />

              {/* 🛡️ Admin Routes */}
              <Route path="/admin/profile-view" element={<ProtectedAdminRoute><AdminProfileViewPage /></ProtectedAdminRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminHome /></ProtectedAdminRoute>} />
              <Route path="/admin/teacher-signup" element={<ProtectedAdminRoute><TeacherSignup /></ProtectedAdminRoute>} />
              <Route path="/admin/teachers" element={<ProtectedAdminRoute><TeachersList /></ProtectedAdminRoute>} />
              <Route path="/admin/student-signup" element={<ProtectedAdminRoute><StudentSignup /></ProtectedAdminRoute>} />
              <Route path="/admin/students" element={<ProtectedAdminRoute><StudentList /></ProtectedAdminRoute>} />
              <Route path="/admin/classDivisionConfig" element={<ProtectedAdminRoute><ClassDivisionConfig /></ProtectedAdminRoute>} />
              <Route path="/admin/class-management" element={<ProtectedAdminRoute><ClassManagment /></ProtectedAdminRoute>} />
              <Route path="/admin/manage-subjects" element={<ProtectedAdminRoute><ManageSubjects /></ProtectedAdminRoute>} />
              <Route path="/admin/exam-marks/add/:role" element={<ProtectedAdminRoute><AddExamMarkAdmin /></ProtectedAdminRoute>} />
              <Route path="/admin/feesconfig/option" element={<ProtectedAdminRoute><FeeManagmentOption /></ProtectedAdminRoute>} />
              <Route path="/admin/fees/history" element={<ProtectedAdminRoute><StudentFeesHistory /></ProtectedAdminRoute>} />
              <Route path="/admin/fees/config" element={<ProtectedAdminRoute><ConfigFeesStructure /></ProtectedAdminRoute>} />
              <Route path="/admin/fees/payment" element={<ProtectedAdminRoute><StudentFeeManager /></ProtectedAdminRoute>} />
              <Route path="/admin/fees/history/:id" element={<PaymentHistory />} />
              <Route path="/admin/timetable" element={<ProtectedAdminRoute><CreateTimetablePage /></ProtectedAdminRoute>} />
              <Route path="/admin/timetable/all" element={<ProtectedAdminRoute><AllClassTimetablePage /></ProtectedAdminRoute>} />
              <Route path="/admin/timetable/option" element={<ProtectedAdminRoute><OptionTwoCardPage /></ProtectedAdminRoute>} />
              <Route path="/admin/teacher-class-access" element={<ProtectedAdminRoute><TeacherAccessConfigPage /></ProtectedAdminRoute>} />
              <Route path="/admin/teacher-profile/edit/:id" element={<ProtectedAdminRoute><EditTeacherProfile /></ProtectedAdminRoute>} />
              <Route path="/admin/attendance-Dashboard/:role" element={<ProtectedAdminRoute><AttendanceDashboardAdmin /></ProtectedAdminRoute>} />
              <Route path="/admin/attendance-history/:role" element={<ProtectedAdminRoute><AttendanceHistoryAdmin /></ProtectedAdminRoute>} />
              <Route path="/admin/take-attendance/:role" element={<ProtectedAdminRoute><StudentAttendanceAdmin /></ProtectedAdminRoute>} />
              <Route path="/admin/school-announcements" element={<ProtectedAdminRoute><SchoolAnnouncementsPage /></ProtectedAdminRoute>} />

              {/* 👩‍🏫 Teacher Routes */}
              <Route path="/teacher/dashboard" element={<ProtectedTeacherRoute><TeacherHomePage /></ProtectedTeacherRoute>} />
              <Route path="/teacher/today-schedule" element={<ProtectedTeacherRoute><TeacherTodaySchedule /></ProtectedTeacherRoute>} />
              <Route path="/teacher/take-attendance/:role" element={<ProtectedTeacherRoute><AttendancePage /></ProtectedTeacherRoute>} />
              <Route path="/teacher/attendance-Dashboard/:role" element={<ProtectedTeacherRoute><AttendanceDashboardPage /></ProtectedTeacherRoute>} />
              <Route path="/teacher/attendance-history/:role" element={<ProtectedTeacherRoute><AttendanceHistoryPage /></ProtectedTeacherRoute>} />
              <Route path="/students-by-class" element={<ProtectedTeacherRoute><ClassStudentListPage /></ProtectedTeacherRoute>} />
              <Route path="/students/profile/:id" element={<ProtectedTeacherRoute><StudentProfileCardPage /></ProtectedTeacherRoute>} />
              <Route path="/teacher/timetable" element={<ProtectedTeacherRoute><ClasswiseTimetableViewerPage /></ProtectedTeacherRoute>} />
              <Route path="/teacher/assign-homework" element={<ProtectedTeacherRoute><AssignHomeworkPage /></ProtectedTeacherRoute>} />
              <Route path="/teacher/homework/details/:id" element={<ProtectedTeacherRoute><HomeworkDetailPage /></ProtectedTeacherRoute>} />
              <Route path="/student/details" element={<ProtectedTeacherRoute><FullStudentInfo /></ProtectedTeacherRoute>} />
              <Route path="/teacher/details" element={<ProtectedTeacherRoute><TeacherDetails /></ProtectedTeacherRoute>} />
              <Route path="/teacher/exam-marks/add/:role" element={<ProtectedTeacherRoute><AddExamMarkTeacher /></ProtectedTeacherRoute>} />
              <Route path="/teacher/homework-archive" element={<ProtectedTeacherRoute><HomeworkListPage/></ProtectedTeacherRoute>} />

              {/* 👪 Parent Routes */}
              <Route path="/parent/dashboard" element={<ProtectedParentRoute><ParentEntryHomePage /></ProtectedParentRoute>} />
              <Route path="/parent/Home" element={<ProtectedParentRoute><ParentHomePage /></ProtectedParentRoute>} />
               <Route path="/verified-submitted-homework/parent" element={<ProtectedParentRoute><VerifiedSubmittedHomeworkPage/></ProtectedParentRoute>} />


              {/* 🎓 Student Routes */}
               <Route path="/verified-submitted-homework/student" element={<ProtectedStudentRoute><VerifiedSubmittedHomeworkPage/></ProtectedStudentRoute>} />
              <Route path="/student/dashboard" element={<ProtectedStudentRoute><StudentHome /></ProtectedStudentRoute>} />
              <Route path="/student/timeTable" element={<ProtectedStudentRoute><StudentTimetablePage /></ProtectedStudentRoute>} />
              <Route path="/student/teacher-list" element={<ProtectedStudentRoute><StudentTeacherListPage /></ProtectedStudentRoute>} />
              <Route path="/student/school-announcement" element={<ProtectedStudentRoute><SchoolMessagePage /></ProtectedStudentRoute>} />
              <Route path="/student/Home-Work" element={<ProtectedStudentRoute><StudentHomeworkPage /></ProtectedStudentRoute>} />
              <Route path="/student/progress-report" element={<ProtectedStudentRoute><StudentProgressReportPage /></ProtectedStudentRoute>} />
              <Route path="/student/Fees-History/:role" element={<ProtectedStudentRoute><StudentFeesHistoryPage /></ProtectedStudentRoute>} />

            </Routes>
          </PageWrapper>
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default AnimatedRoutes;
