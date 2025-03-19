import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store";
import { SocketProvider } from "./context/SocketContext";

// Components
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";
import TokenRefreshHandler from "./components/auth/TokenRefreshHandler";

// Routes
import { publicRoutes, privateRoutes, notFoundRoute } from "./routes";

// Import the MyCalendar component
import MyCalendar from "./pages/MyCalendar";

// Import the EventNotification component
import EventNotification from "./components/EventNotification";

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: 20, margin: 20, backgroundColor: "#ffdddd" }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.toString()}</p>
          <button onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SocketProvider>
            {/* TokenRefreshHandler will setup the auto token refresh within Redux context */}
            <TokenRefreshHandler />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <EventNotification />
            <div className="App">
              <header className="App-header">
                <Routes>
                  {/* Public Routes */}
                  {publicRoutes.map(({ path, component: Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                  ))}

                  {/* Private Routes */}
                  <Route element={<Layout />}>
                    <Route
                      index
                      element={<Navigate to="/dashboard" replace />}
                    />

                    {privateRoutes.map(
                      ({ path, component: Component, roles }) => (
                        <Route
                          key={path}
                          path={path}
                          element={
                            <PrivateRoute roles={roles}>
                              <Component />
                            </PrivateRoute>
                          }
                        />
                      )
                    )}
                  </Route>

                  {/* 404 Route */}
                  {(() => {
                    const { path, component: NotFound } = notFoundRoute;
                    return <Route path={path} element={<NotFound />} />;
                  })()}

                  {/* Add the route for MyCalendar */}
                  <Route
                    path="/calendar"
                    element={
                      <PrivateRoute>
                        <MyCalendar />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </header>
            </div>
          </SocketProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
