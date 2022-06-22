import { Component } from "react";
import Swal from "sweetalert2";

class ErrorBoundary extends Component {
  state = {
    errorMessage: "",
  };

  handlePromiseRejection = (error) => {
    console.log("Promise ERRBoundary");
    this.setState({
      errorMessage: error.reason,
    });
  };

  componentDidMount() {
    window.addEventListener("unhandledrejection", this.handlePromiseRejection);
  }

  componentWillUnmount() {
    window.removeEventListener("unhandledrejection", this.handlePromiseRejection);
  }

  componentDidCatch(error, info) {
    this.setState({
      errorMessage: error,
    });
  }

  componentDidUpdate() {
    if (this.state.errorMessage != "") {
      Swal.fire({
        icon: "error",
        text: this.state.errorMessage,
      });

      this.setState({
        errorMessage: "",
      });
    }
  }

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
