import { useCallback, useEffect, useRef, useState } from "react";
import type { TimerState } from "../hooks/useTimer";
import { useI18n } from "../i18n";

const pad = (n: number) => String(n).padStart(2, "0");

function HeaderTimer({
  timer,
  onTimerTab,
}: {
  timer: TimerState;
  onTimerTab: () => void;
}) {
  return (
    <div
      className="header-timer"
      onClick={(e) => {
        e.stopPropagation();
        onTimerTab();
      }}
    >
      <span className={`header-timer-time ${timer.overtime ? "overtime" : ""}`}>
        {timer.overtime && "+"}
        {pad(timer.minutes)}:{pad(timer.seconds)}
      </span>
      <button
        className="header-timer-reset"
        onClick={(e) => {
          e.stopPropagation();
          timer.restart();
        }}
        title="Reset"
      >
        ↺
      </button>
    </div>
  );
}

interface Props {
  visible: boolean;
  collapsed: boolean;
  hideBody: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  timer: TimerState;
  onTimerTab: () => void;
  children: React.ReactNode;
}

export function Modal({
  visible,
  collapsed,
  hideBody,
  onClose,
  onToggleCollapse,
  timer,
  onTimerTab,
  children,
}: Props) {
  const { locale, setLocale } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mouseDownPos = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);

  useEffect(() => {
    if (visible) {
      setPos({ x: window.innerWidth - 440, y: 20 });
    }
  }, [visible]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true);
      didDrag.current = false;
      dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      mouseDownPos.current = { x: e.clientX, y: e.clientY };
    },
    [pos],
  );

  const onHeaderClick = useCallback(
    (e: React.MouseEvent) => {
      if (didDrag.current) return;
      if ((e.target as HTMLElement).closest(".modal-close")) return;
      onToggleCollapse();
    },
    [onToggleCollapse],
  );

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseDownPos.current.x;
      const dy = e.clientY - mouseDownPos.current.y;
      if (!didDrag.current && Math.abs(dx) + Math.abs(dy) > 4) {
        didDrag.current = true;
      }
      setPos({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    };
    const onMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  if (!visible) return null;

  return (
    <div className="overlay">
      <div
        ref={modalRef}
        className={`modal ${collapsed ? "collapsed" : ""}`}
        style={{ left: pos.x, top: pos.y }}
      >
        <div
          className="modal-header"
          onMouseDown={onMouseDown}
          onClick={onHeaderClick}
        >
          <span className="modal-title">FaciBox</span>
          {(timer.running || timer.overtime) && (
            <HeaderTimer timer={timer} onTimerTab={onTimerTab} />
          )}
          <button
            className="lang-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setLocale(locale === "ja" ? "en" : "ja");
            }}
          >
            {locale === "ja" ? "EN" : "JA"}
          </button>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={`modal-body ${hideBody ? "hidden" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
