import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { LogoMark } from '../common/LogoMark.jsx';
import { AuthBackground } from '../common/AuthBackground.jsx';

export function AuthView() {
  const {
    currentUser, overlayPhase, authTab, setAuthTab,
    loginDraft, setLoginDraft, isSigning, doLogin, pushToast,
    doRegister
  } = useApp();

  return (
      <div className={`auth-scr ${!currentUser ? "show" : ""}`} id="authScr">
        <AuthBackground active={!currentUser} />
        <div className={`auth-box ${overlayPhase !== "idle" ? "fade-out" : ""}`} id="authBox">
          <div className="auth-logo">
            <LogoMark size={28} />
            <span
              style={{
                fontFamily: "var(--head)",
                fontSize: "15px",
                fontWeight: 800,
                letterSpacing: "-0.3px",
                paddingTop: "6px",
              }}
            >
              TaskForge
            </span>
          </div>

          <div className="auth-h">Sign in to your workspace.</div>
          <div className="auth-s">Manage projects, tasks, and your team.</div>

          <div className="auth-tabs">
            <div
              className={`auth-tab ${authTab === "login" ? "act" : ""}`}
              onClick={() => setAuthTab("login")}
            >
              Sign in
            </div>
            <div
              className={`auth-tab ${authTab === "register" ? "act" : ""}`}
              onClick={() => setAuthTab("register")}
            >
              Register
            </div>
          </div>

          {authTab === "login" ? (
            <div>
              <div className="fg">
                <label className="fl">Email address</label>
                <input
                  className="fi"
                  type="email"
                  value={loginDraft.email}
                  placeholder="you@company.com"
                  onChange={(event) =>
                    setLoginDraft((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="fg">
                <label className="fl">Password</label>
                <input
                  className="fi"
                  type="password"
                  value={loginDraft.password}
                  placeholder="••••••••"
                  onChange={(event) =>
                    setLoginDraft((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
              </div>

              <button
                className="btn btn-p"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "9px 13px",
                }}
                onClick={doLogin}
                disabled={isSigning}
              >
                {isSigning ? "Signing in..." : "Continue"}
              </button>
              <div className="auth-lnk">
                <a
                  onClick={() =>
                    pushToast("Password reset link sent to your email.", "ok")
                  }
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          ) : (
            <div>
              <div className="g2">
                <div className="fg">
                  <label className="fl">First name</label>
                  <input className="fi" type="text" placeholder="Ada" />
                </div>
                <div className="fg">
                  <label className="fl">Last name</label>
                  <input className="fi" type="text" placeholder="Lovelace" />
                </div>
              </div>

              <div className="fg">
                <label className="fl">Email address</label>
                <input
                  className="fi"
                  type="email"
                  placeholder="you@company.com"
                />
              </div>

              <div className="fg">
                <label className="fl">Password</label>
                <input
                  className="fi"
                  type="password"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <button
                className="btn btn-p"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "9px 13px",
                }}
                onClick={doRegister}
                disabled={isSigning}
              >
                {isSigning ? "Creating..." : "Create account"}
              </button>
            </div>
          )}
        </div>
      </div>
  );
}
