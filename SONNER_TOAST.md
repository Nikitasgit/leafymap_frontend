# Sonner Toast Notifications

Simple, clean toast notifications using Sonner library.

## Usage

```typescript
import { useToast } from "@/hooks/useToast";

const { showSuccess, showError, showInfo, showLoading, showPromise } =
  useToast();
```

## Examples

### Basic Usage

```typescript
// Success
showSuccess("Profile updated successfully!");

// Error
showError("Failed to save changes");

// Info
showInfo("Please wait while we process your request");
```

### Loading States

```typescript
const loadingToast = showLoading("Processing...");

try {
  await someAsyncOperation();
  toast.dismiss(loadingToast);
  showSuccess("Done!");
} catch (error) {
  toast.dismiss(loadingToast);
  showError("Failed!");
}
```

### Promise-based (Recommended)

```typescript
// Automatically handles loading, success, and error states
showPromise(saveUserProfile(data), {
  loading: "Saving profile...",
  success: "Profile saved successfully!",
  error: "Failed to save profile",
});
```

## Styling Options

### 1. Global CSS Customization (Recommended)

Edit `src/styles/components/_sonner.scss`:

```scss
// Custom toast styling
[data-sonner-toast] {
  border-radius: 8px !important;
  font-family: $font-family-base !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid !important;
  padding: 12px 16px !important;
  max-width: 320px !important;
}

// Success toast
[data-sonner-toast][data-type="success"] {
  border-left: 4px solid #{$success-color} !important;
}

// Error toast
[data-sonner-toast][data-type="error"] {
  border-left: 4px solid #{$error-color} !important;
}
```

### 2. Inline Styling

In `Providers.tsx`:

```typescript
<Toaster
  position="bottom-right"
  richColors
  closeButton
  duration={3000}
  theme="light"
  expand={false}
  className="custom-toaster"
  toastOptions={{
    style: {
      background: "#ffffff",
      color: "#3a3a3a",
      border: "1px solid #e1e1e1",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      fontSize: "14px",
      fontWeight: "500",
      padding: "12px 16px",
      maxWidth: "320px",
    },
  }}
/>
```

### 3. Individual Toast Styling

```typescript
// Custom style for specific toast
toast.success("Success!", {
  style: {
    background: "#28a745",
    color: "white",
    border: "none",
  },
});

// Custom duration
toast.error("Error!", { duration: 10000 });

// Custom icon
toast.success("Success!", { icon: "🎉" });
```

### 4. CSS Variables

Sonner supports CSS variables for theming:

```scss
[data-sonner-toaster] {
  --normal-bg: #ffffff;
  --normal-border: #e1e1e1;
  --normal-text: #3a3a3a;

  --success-bg: #ffffff;
  --success-border: #28a745;
  --success-text: #3a3a3a;

  --error-bg: #ffffff;
  --error-border: #dc3545;
  --error-text: #3a3a3a;
}
```

## Configuration Options

| Option        | Type    | Default     | Description            |
| ------------- | ------- | ----------- | ---------------------- |
| `position`    | string  | `top-right` | Position of toasts     |
| `richColors`  | boolean | `false`     | Use rich colors        |
| `closeButton` | boolean | `false`     | Show close button      |
| `duration`    | number  | `4000`      | Auto-dismiss duration  |
| `theme`       | string  | `light`     | Light/dark theme       |
| `expand`      | boolean | `false`     | Expand toasts on hover |
| `className`   | string  | -           | Custom CSS class       |

## Features

- ✅ Clean, minimal design
- ✅ Rich colors (green success, red error, blue info)
- ✅ Close button on each toast
- ✅ Auto-dismiss after 3 seconds
- ✅ Bottom-right positioning
- ✅ Smooth animations
- ✅ Promise support for async operations
- ✅ Highly customizable styling

## Migration from React Hot Toast

The API is very similar, just cleaner:

```typescript
// Before (React Hot Toast)
toast.success("Success!");

// After (Sonner)
toast.success("Success!");
```

Sonner provides better default styling and simpler configuration!
