import React from "react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { AuthView } from "./components/views/AuthView.jsx";
import { Sidebar } from "./components/layout/Sidebar.jsx";
import { Topbar } from "./components/layout/Topbar.jsx";
import { MainView } from "./components/views/MainView.jsx";
import { Modals } from "./components/layout/Modals.jsx";
import { LogoMark } from "./components/common/LogoMark.jsx";

function AppShell() {
  const { currentUser, isAppEntering, toasts, overlayPhase, progressWidth } = useApp();

  const overlayClassName = overlayPhase === "idle" ? "" : `react-active phase-${overlayPhase}`;

  return (
    <>
      <div id="pbar" style={{ width: `${progressWidth}%` }} />

      <div className="tc-wr" id="tWrap" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`tst tst-${toast.type} tf-toast-enter`}>
            {toast.message}
          </div>
        ))}
      </div>

      <div id="loginOverlay" className={overlayClassName}>
        <div id="loginOverlayTop" />
        <div id="loginOverlayBot" />
        <div id="loginOverlaySeam" />
        <div id="loginOverlayLogo">
          <LogoMark size={52} />
          <span id="loginOverlayWord">TaskForge</span>
        </div>
      </div>

      {!currentUser ? (
        <AuthView />
      ) : (
        <>
          <Sidebar />
          <main className="main">
            <Topbar />
            <MainView />
          </main>
          <Modals />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
