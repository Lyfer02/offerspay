import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Always log in dev
    console.error('Error caught by boundary:', error, errorInfo);

    // Optional: send to a monitoring service (e.g., Sentry, Bugsnag)
    // if (!__DEV__) {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>

          {/* Show error details only in development */}
          {__DEV__ && (
            <>
              <Text style={styles.subtitle}>
                {this.state.error?.toString()}
              </Text>
              <Text style={styles.details}>
                {this.state.errorInfo?.componentStack}
              </Text>
            </>
          )}

          {/* Retry button */}
          <TouchableOpacity onPress={this.handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: 'red',
  },
  details: {
    fontSize: 12,
    color: '#888',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ErrorBoundary;
