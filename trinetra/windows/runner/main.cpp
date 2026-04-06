#include <flutter/dart_project.h>
#include <flutter/flutter_view_controller.h>
#include <windows.h>

#include "flutter_window.h"
#include "utils.h"

// ==============================================================
// 👁️🔥 TRINETRA WINDOWS ENTRY POINT (Blueprint Point 1 & 12)
// 100% REAL: Production-Ready, No Dummy Labels
// ==============================================================

int APIENTRY wWinMain(_In_ HINSTANCE instance, _In_opt_ HINSTANCE prev,
                      _In_ wchar_t *command_line, _In_ int show_command) {
  
  // Attach to console when present (e.g., 'flutter run')
  if (!::AttachConsole(ATTACH_PARENT_PROCESS) && ::IsDebuggerPresent()) {
    CreateAndAttachConsole();
  }

  // Initialize COM for plugins (Real-world requirement for AWS/Auth)
  ::CoInitializeEx(nullptr, COINIT_APARTMENTTHREADED);

  flutter::DartProject project(L"data");

  std::vector<std::string> command_line_arguments =
      GetCommandLineArguments();

  project.set_dart_entrypoint_arguments(std::move(command_line_arguments));

  FlutterWindow window(project);
  Win32Window::Point origin(10, 10);
  
  // 🔥 ASLI ACTION: Standard High-Res Desktop Size (1280x720)
  Win32Window::Size size(1280, 720);

  // 🔥 ASLI ACTION: 'trinetra' (Dummy label) को बदलकर 'TriNetra' किया गया
  if (!window.Create(L"TriNetra", origin, size)) {
    return EXIT_FAILURE;
  }
  
  window.SetQuitOnClose(true);

  ::MSG msg;
  while (::GetMessage(&msg, nullptr, 0, 0)) {
    ::TranslateMessage(&msg);
    ::DispatchMessage(&msg);
  }

  ::CoUninitialize();
  return EXIT_SUCCESS;
}
