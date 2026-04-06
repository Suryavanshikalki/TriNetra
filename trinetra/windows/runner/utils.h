#ifndef RUNNER_UTILS_H_
#define RUNNER_UTILS_H_

#include <string>
#include <vector>

// ==============================================================
// 👁️🔥 TRINETRA WINDOWS UTILITY HEADERS (Point 1, 12 & Multilanguage)
// 100% REAL: UTF-8 Bridge Interface | Production Ready
// ==============================================================

// 🔥 ASLI ACTION: डीबग कंसोल को अटैच करने का इंटरफेस
// यह पक्का करता है कि 'TriNetra' का बैकएंड लॉग्स Windows पर सही से दिखे।
void CreateAndAttachConsole();

// 🔥 ASLI ACTION: UTF-16 (Windows) से UTF-8 (Flutter) कन्वर्जन।
// इसी की वजह से तुम्हारी ऐप में हिंदी और अन्य भाषाएँ बिना किसी एरर के दिखेंगी।
std::string Utf8FromUtf16(const wchar_t* utf16_string);

// 🔥 ASLI ACTION: कमांड लाइन आर्गुमेंट्स को सुरक्षित रूप से पढ़ना।
std::vector<std::string> GetCommandLineArguments();

#endif  // RUNNER_UTILS_H_
