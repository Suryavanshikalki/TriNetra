#ifndef RUNNER_WIN32_WINDOW_H_
#define RUNNER_WIN32_WINDOW_H_

#include <windows.h>
#include <functional>
#include <memory>
#include <string>

// ==============================================================
// 👁️🔥 TRINETRA WINDOWS CORE SKELETON (Point 1 & 12)
// 100% REAL: High DPI-Aware Architecture | Facebook 2026 Standard
// ==============================================================

// Win32Window क्लास Windows OS और Flutter Engine के बीच का असली 'ब्रिज' (Bridge) है।
class Win32Window {
 public:
  // स्क्रीन पर लोकेशन के लिए Point स्ट्रक्चर
  struct Point {
    unsigned int x;
    unsigned int y;
    Point(unsigned int x, unsigned int y) : x(x), y(y) {}
  };

  // विंडो के साइज़ के लिए Size स्ट्रक्चर
  struct Size {
    unsigned int width;
    unsigned int height;
    Size(unsigned int width, unsigned int height)
        : width(width), height(height) {}
  };

  Win32Window();
  virtual ~Win32Window();

  // 🔥 ASLI ACTION: 'TriNetra' की मुख्य खिड़की (Window) को रजिस्टर और क्रिएट करना।
  // यह High-DPI सेटिंग्स के साथ सिंक होकर खुलती है।
  bool Create(const std::wstring& title, const Point& origin, const Size& size);

  // विंडो को विज़िबल बनाना।
  bool Show();

  // मेमोरी और हैंडल को सुरक्षित तरीके से रिलीज करना।
  void Destroy();

  // Flutter के विज़ुअल्स को इस Windows कंटेनर के अंदर सेट करना।
  void SetChildContent(HWND content);

  // सिस्टम का असली HWND (Handle) प्राप्त करना।
  HWND GetHandle();

  // अगर यह True है, तो विंडो बंद होते ही पूरी ऐप का प्रोसेस खत्म हो जाएगा।
  void SetQuitOnClose(bool quit_on_close);

  // स्क्रीन के उस हिस्से का माप लेना जहाँ UI रेंडर होगा।
  RECT GetClientArea();

 protected:
  // Windows OS द्वारा भेजे गए हर सिग्नल (Resize, Close, Keyboard) को प्रोसेस करना।
  virtual LRESULT MessageHandler(HWND window,
                                 UINT const message,
                                 WPARAM const wparam,
                                 LPARAM const lparam) noexcept;

  virtual bool OnCreate();
  virtual void OnDestroy();

 private:
  friend class WindowClassRegistrar;

  // OS CALLBACK: सिस्टम के लो-लेवल मैसेजेस को रिसीव करने वाला 'Asli' गेटकीपर।
  static LRESULT CALLBACK WndProc(HWND const window,
                                  UINT const message,
                                  WPARAM const wparam,
                                  LPARAM const lparam) noexcept;

  // हैंडल से क्लास ऑब्जेक्ट को मैप करना।
  static Win32Window* GetThisFromHandle(HWND const window) noexcept;

  // 🔥 ASLI ACTION: Windows 11/10 के Dark Mode और Light Mode के साथ Real-time सिंक।
  static void UpdateTheme(HWND const window);

  // विंडो का इंटरनल डेटा
  bool quit_on_close_ = false;
  HWND window_handle_ = nullptr;
  HWND child_content_ = nullptr;
};

#endif  // RUNNER_WIN32_WINDOW_H_
