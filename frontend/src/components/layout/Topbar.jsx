import React from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function Topbar() {
  const {
    isAppEntering, topMeta, searchQuery, setSearchQuery, runSearch,
    setTheme, handleTopCta
  } = useApp();

  return (
            <div className={`topbar ${isAppEntering ? "entering" : ""}`}>
              <div className="top-title" id="topT">
                {topMeta.title}
                <span className="top-sub" id="topS">
                  {topMeta.sub ? ` — ${topMeta.sub}` : ""}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="sw">
                  <span className="si">
                    <Search size={14} />
                  </span>
                  <input
                    className="sf"
                    type="text"
                    autoComplete="off"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        runSearch();
                      }
                    }}
                  />
                </div>

                <button
                  className="theme-toggle"
                  id="themeToggle"
                  onClick={() =>
                    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                  }
                  title="Toggle dark mode"
                >
                  <Moon className="icon-moon" />
                  <Sun className="icon-sun" />
                </button>

                <button
                  className="btn btn-p"
                  id="topCTA"
                  onClick={handleTopCta}
                  style={{ display: topMeta.showCta ? "inline-flex" : "none" }}
                >
                  {topMeta.cta}
                </button>
              </div>
            </div>
  );
}
