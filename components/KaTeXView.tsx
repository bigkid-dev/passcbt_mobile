import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { moderateScale } from "react-native-size-matters";

interface KaTeXViewProps {
  content: string;
  isDark?: boolean;
  fontSize?: number;
}

export function KaTeXView({
  content,
  isDark = true,
  fontSize = 16,
}: KaTeXViewProps) {
  const [webViewHeight, setWebViewHeight] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);

  const cleanContent = (content || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");

  const textColor = isDark ? "#E5E7EB" : "#1F2937";
  const bgColor = isDark ? "transparent" : "#FFFFFF";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: ${fontSize}px;
      line-height: 1.6;
      color: ${textColor};
      background-color: ${bgColor};
      padding: 4px;
      overflow-x: auto;
      word-wrap: break-word;
    }
    .katex {
      font-size: 1.05em;
    }
    .katex-display {
      margin: 0.5em 0;
      overflow-x: auto;
      overflow-y: hidden;
    }
  </style>
</head>
<body>
  <div id="content"></div>
  <script>
    const raw = "${cleanContent}";
    const container = document.getElementById("content");
    container.innerHTML = raw;

    renderMathInElement(container, {
      delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "\\\\[", right: "\\\\]", display: true},
        {left: "$", right: "$", display: false},
        {left: "\\\\(", right: "\\\\)", display: false}
      ],
      throwOnError: false
    });

    function sendHeight() {
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
    }

    setTimeout(sendHeight, 100);
    window.addEventListener("resize", sendHeight);
  </script>
</body>
</html>
  `;

  return (
    <View style={[styles.container, { minHeight: webViewHeight }]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={[styles.webView, { height: webViewHeight }]}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height) {
              setWebViewHeight(Math.max(30, Math.ceil(data.height)));
              setLoading(false);
            }
          } catch {}
        }}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#3B82F6" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  webView: {
    backgroundColor: "transparent",
    width: "100%",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
