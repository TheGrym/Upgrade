import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: "fixed", inset: 0,
          background: "#08080B", color: "#FF6200",
          fontFamily: "monospace", fontSize: 13,
          padding: 24, overflowY: "auto", zIndex: 99999,
        }}>
          <div style={{ color: "#FF3D3D", fontSize: 16, fontWeight: "bold", marginBottom: 16 }}>
            ⚠ RENDER ERROR
          </div>
          <pre style={{ whiteSpace: "pre-wrap", color: "#EAEAE6" }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ whiteSpace: "pre-wrap", color: "#76767E", fontSize: 11, marginTop: 12 }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
