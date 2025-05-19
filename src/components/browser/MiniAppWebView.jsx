import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './styles/MiniAppWebViewStyle';
import {ICONS, COLORS} from '../../constants';

// Dynamic IconComponents object
const IconComponents = {
  MaterialIcons: require('react-native-vector-icons/MaterialIcons').default,
  Ionicons: require('react-native-vector-icons/Ionicons').default,
};

// Default icon config to prevent undefined errors
const DEFAULT_ICON = {
  library: 'Ionicons',
  name: 'star',
  size: 24,
};

const MiniAppWebView = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const webViewRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const {webViewData: webViewDataRaw} = route.params || {};
  // States to track WebView navigation
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Define icon components with fallbacks
  const BackArrowIcon =
    IconComponents[ICONS.BACK_ARROW?.library || DEFAULT_ICON.library];
  const RefreshIcon =
    IconComponents[ICONS.REFRESH?.library || DEFAULT_ICON.library];
  const BackIosIcon =
    IconComponents[ICONS.BACK_IOS?.library || DEFAULT_ICON.library];
  const ForwardIosIcon =
    IconComponents[ICONS.FORWARD_IOS?.library || DEFAULT_ICON.library];

  // Parse webViewData if it's a JSON string
  let webViewData;
  try {
    webViewData =
      typeof webViewDataRaw === 'string' && webViewDataRaw.trim() !== ''
        ? JSON.parse(webViewDataRaw)
        : webViewDataRaw;
  } catch (e) {
    console.error('Failed to parse webViewData as JSON:', e.message);
    webViewData = webViewDataRaw;
  }

  // Extract URL from webViewData if it's an object
  const url =
    typeof webViewData === 'object' && webViewData?.url
      ? webViewData.url
      : webViewData;

  // Log initial WebView data
  console.log('WebView Initial Data:', {
    url,
    webViewDataRaw,
    webViewData,
    webViewRef: !!webViewRef.current,
  });

  // Loading timeout effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
        setError(
          'Page is taking too long to load. Try again or check your connection.',
        );
        console.log('WebView Timeout:', {
          url,
          isLoading,
          timeout: '15 seconds exceeded',
        });
      }
    }, 15000); // 15 seconds timeout
    return () => clearTimeout(timeout);
  }, [isLoading, url]);

  // Handle empty or invalid URL
  if (!url || typeof url !== 'string' || url.trim() === '') {
    console.warn('No valid URL provided, rendering error screen', {
      url,
      webViewData,
    });
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon
              name={ICONS.BACK_ARROW?.name || DEFAULT_ICON.name}
              size={24}
              color={COLORS.BLACK || '#000'}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mini App</Text>
          <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
            <RefreshIcon
              name={ICONS.REFRESH?.name || DEFAULT_ICON.name}
              size={24}
              color={COLORS.BLACK || '#000'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: COLORS.ERROR || '#ff0000'}]}>
            No valid content provided for this miniApp. Please contact support
            or try again.
          </Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            disabled={true}>
            <BackIosIcon
              name={ICONS.BACK_IOS?.name || DEFAULT_ICON.name}
              size={24}
              color={COLORS.DISABLED || '#ccc'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goForward()}
            disabled={true}>
            <ForwardIosIcon
              name={ICONS.FORWARD_IOS?.name || DEFAULT_ICON.name}
              size={24}
              color={COLORS.DISABLED || '#ccc'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Validate URL format
  if (!url.startsWith('http')) {
    console.error('Invalid URL, rendering error screen:', {url, webViewData});
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon
              name={ICONS.BACK_ARROW?.name || DEFAULT_ICON.name}
              size={24}
              color={COLORS.BLACK || '#000'}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mini App</Text>
          <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
            <RefreshIcon
              name={ICONS.REFRESH?.name || DEFAULT_ICON.name}
              size={24}
              color={COLORS.BLACK || '#000'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: COLORS.ERROR || '#ff0000'}]}>
            Invalid URL format: Must be a valid HTTP/HTTPS URL.
          </Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            disabled={true}>
            <BackIosIcon
              name={ICONS.BACK_IOS?.name || DEFAULT_ICON.name}
              size={24}
              color={COLORS.DISABLED || '#ccc'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goForward()}
            disabled={true}>
            <ForwardIosIcon
              name={ICONS.FORWARD_IOS?.name || DEFAULT_ICON.name}
              size={24}
              color={COLORS.DISABLED || '#ccc'}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setLoadingTimeout(false);
    console.log('WebView Retry:', {url});
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon
            name={ICONS.BACK_ARROW?.name || DEFAULT_ICON.name} // Fixed typo
            size={24}
            color={COLORS.BLACK || '#000'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mini App</Text>
        <TouchableOpacity onPress={() => handleRetry()}>
          <RefreshIcon
            name={ICONS.REFRESH?.name || DEFAULT_ICON.name}
            size={24}
            color={COLORS.BLACK || '#000'}
          />
        </TouchableOpacity>
      </View>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: COLORS.ERROR || '#ff0000'}]}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{uri: url}}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowUniversalAccessFromFileURLs={false}
          allowsBackForwardNavigationGestures={true}
          cacheEnabled={true}
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          thirdPartyCookiesEnabled={false}
          setSupportMultipleWindows={false}
          androidHardwareAccelerationDisabled={false}
          androidLayerType="hardware"
          mixedContentMode="always"
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={COLORS.PRIMARY || '#4c86A8'}
              />
              {loadingTimeout && (
                <Text style={styles.loadingText}>
                  Loading is taking longer than expected...
                </Text>
              )}
            </View>
          )}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.error('WebView Error:', {
              url,
              nativeEvent,
              description: nativeEvent.description || 'Unknown error',
            });
            setError(nativeEvent.description || 'Unknown error');
            setIsLoading(false);
          }}
          onHttpError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.error('WebView HTTP Error:', {
              url,
              nativeEvent,
              statusCode: nativeEvent.statusCode,
            });
            setError(`HTTP Error ${nativeEvent.statusCode}`);
            setIsLoading(false);
          }}
          onMessage={event => {
            console.log('WebView Message:', {
              url,
              data: event.nativeEvent.data,
              nativeEvent: event.nativeEvent,
            });
          }}
          onNavigationStateChange={navState => {
            console.log('WebView Navigation State:', {
              url,
              navState,
              canGoBack: navState.canGoBack,
              canGoForward: navState.canGoForward,
              currentUrl: navState.url,
              title: navState.title,
            });
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
          }}
          onLoadStart={() => {
            console.log('WebView Load Start:', {url});
            setIsLoading(true);
          }}
          onLoadEnd={() => {
            console.log('WebView Load End:', {url, isLoading: false});
            setIsLoading(false);
          }}
        />
      )}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => webViewRef.current?.goBack()}
          disabled={!canGoBack}>
          <BackIosIcon
            name={ICONS.BACK_IOS?.name || DEFAULT_ICON.name}
            size={24}
            color={
              canGoBack ? COLORS.BLACK || '#000' : COLORS.DISABLED || '#ccc'
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => webViewRef.current?.goForward()}
          disabled={!canGoForward}>
          <ForwardIosIcon
            name={ICONS.FORWARD_IOS?.name || DEFAULT_ICON.name}
            size={24}
            color={
              canGoForward ? COLORS.BLACK || '#000' : COLORS.DISABLED || '#ccc'
            }
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MiniAppWebView;
