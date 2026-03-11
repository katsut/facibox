import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  visible: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  children: React.ReactNode;
}

export function Modal({
  visible,
  collapsed,
  onClose,
  onToggleCollapse,
  children,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (visible) {
      setPos({ x: window.innerWidth - 440, y: 20 });
    }
  }, [visible]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true);
      dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    },
    [pos],
  );

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e: MouseEvent) => {
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
    <div className="overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className={`modal ${collapsed ? "collapsed" : ""}`}
        style={{ left: pos.x, top: pos.y }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" onMouseDown={onMouseDown}>
          <span className="modal-title">FaciBox</span>
          <div className="modal-header-actions">
            <button className="modal-collapse" onClick={onToggleCollapse}>
              {collapsed ? "▼" : "▲"}
            </button>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        <div className={`modal-body ${collapsed ? "hidden" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
