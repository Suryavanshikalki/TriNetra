#include "utils.h"

#include <flutter_windows.h>
#include <io.h>
#include <stdio.h>
#include <windows.h>

#include <iostream>

// ==============================================================
// 👁️🔥 TRINETRA WINDOWS UTILITIES (Point 1, 12 & Multilanguage)
// 100% REAL: UTF-8 Bridge & Debug Console Controller
// ==============================================================

void CreateAndAttachConsole() {
  // 🔥 ASLI ACTION: सिर्फ डीबगिंग के समय कंसोल विंडो खोलना।
  if (::AllocConsole()) {
    FILE *unused;
    if (freopen_s(&unused, "CONOUT$", "w", stdout)) {
      _dup2(_fileno(stdout), 1);
    }
    if (freopen_s(&unused, "CONOUT$", "w", stderr)) {
      _dup2(_fileno(stdout), 2);
    }
    std::ios::sync_with_stdio();
    FlutterDesktopResyncOutputStreams();
  }
}

std::vector<std::string> GetCommandLineArguments() {
  // 🔥 ASLI ACTION: Windows के UTF-16 आर्गुमेंट्स को UTF-8 में बदलना।
  // यह 'TriNetra' को कमांड लाइन से भी मल्टी-लैंग्वेज इनपुट लेने में मदद करता है।
  int argc;
  wchar_t** argv = ::CommandLineToArgvW(::GetCommandLineW(), &argc);
  if (argv == nullptr) {
    return std::vector<std::string>();
  }

  std::vector<std::string> command_line_arguments;

  // पहली वैल्यू (Binary Name) को छोड़कर बाकी सबको लिस्ट में जोड़ना।
  for (int i = 1; i < argc; i++) {
    command_line_arguments.push_back(Utf8FromUtf16(argv[i]));
  }

  ::LocalFree(argv);

  return command_line_arguments;
}

std::string Utf8FromUtf16(const wchar_t* utf16_string) {
  // 👁️ TRINETRA MULTILANGUAGE ENGINE:
  // यह फंक्शन पक्का करता है कि हिंदी (Hindi) और अन्य भाषाएँ Windows पर क्रैश न हों।
  if (utf16_string == nullptr) {
    return std::string();
  }
  unsigned int target_length = ::WideCharToMultiByte(
      CP_UTF8, WC_ERR_INVALID_CHARS, utf16_string,
      -1, nullptr, 0, nullptr, nullptr)
    -1; 
    
  int input_length = (int)wcslen(utf16_string);
  std::string utf8_string;
  if (target_length == 0 || target_length > utf8_string.max_size()) {
    return utf8_string;
  }
  utf8_string.resize(target_length);
  int converted_length = ::WideCharToMultiByte(
      CP_UTF8, WC_ERR_INVALID_CHARS, utf16_string,
      input_length, utf8_string.data(), target_length, nullptr, nullptr);
      
  if (converted_length == 0) {
    return std::string();
  }
  return utf8_string;
}
