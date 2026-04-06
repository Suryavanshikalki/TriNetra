#ifndef RUNNER_WIN32_WINDOW_H_
#define RUNNER_WIN32_WINDOW_H_

#include <windows.h>
#include <functional>
#include <memory>
#include <string>

// ==============================================================
// 👁️🔥 TRINETRA WINDOWS CORE SKELETON (Point 1 & 12)
// 100% REAL: High DPI-Aware Architecture | No Dummies
// ==============================================================

// यह क्लास Windows पर 'TriNetra' के विज़ुअल ढांचे (UI Container) को परिभाषित करती है।
class Win32Window {
 public:
  struct Point {
    unsigned int x;
    unsigned int y;
    Point(unsigned int x, unsigned int y) : x(x), y(y) {}
  };

  struct Size {
    unsigned int width;
    unsigned int height;
    Size(unsigned int width, unsigned int height)
        : width(width), height(height) {}
  };

  Win32Window();
  virtual ~Win32Window();

  // 🔥 ASLI ACTION: Windows पर 'TriNetra' की खिड़की बनाना।
  bool Create(const std::wstring& title, const Point& origin, const Size& size);

  // ऐप को स्क्रीन पर दिखाना।
  bool Show();

  // रिसोर्सेज को रिलीज करना।
  void Destroy();

  // Flutter View को Windows विंडो के अंदर सेट करना।
  void SetChildContent(HWND content);

  // असली Windows हैंडल (Handle) प्राप्त करना।
  HWND GetHandle();

  // विंडो बंद होने पर ऐप को पूरी तरह क्विट (Quit) करना।
  void SetQuitOnClose(bool quit_on_close);

  // क्लाइंट एरिया (UI Space) का माप लेना।
  RECT GetClientArea();

 protected:
  // Windows के मैसेजेस (Click, Resize, DPI) को हैंडल करना।
  virtual LRESULT MessageHandler(HWND window,
                                 UINT const message,
                                 WPARAM const wparam,
                                 LPARAM const lparam) noexcept;

  virtual bool OnCreate();
  virtual void OnDestroy();

 private:
  friend class WindowClassRegistrar;

  // OS Callback: सिस्टम के साथ असली तालमेल।
  static LRESULT CALLBACK WndProc(HWND const window,
                                  UINT const message,
                                  WPARAM const wparam,
                                  LPARAM const lparam) noexcept;

  static Win32Window* GetThisFromHandle(HWND const window) noexcept;

  // 🔥 ASLI ACTION: Windows सिस्टम थीम (Dark/Light) के साथ सिंक करना।
  static void UpdateTheme(HWND const window);

  bool quit_on_close_ = false;
  HWND window_handle_ = nullptr;
  HWND child_content_ = nullptr;
};

#endif  // RUNNER_WIN32_WINDOW_H_
