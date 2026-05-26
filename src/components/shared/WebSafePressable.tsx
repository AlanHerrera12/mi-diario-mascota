import { Platform, Pressable, type PressableProps, View } from 'react-native';
import { router } from 'expo-router';
import React from 'react';

interface Props extends Omit<PressableProps, 'onPress'> {
  /** Path to navigate to. If set, navigation happens on press. */
  href?: string;
  /** Custom press handler. Called BEFORE href navigation. */
  onPress?: () => void;
  children?: React.ReactNode;
}

/**
 * Bulletproof clickable wrapper that ALWAYS responds on web.
 *
 * On web + href:  renders a native <a> tag — works with zero JS (no hydration needed).
 *                 onClick intercepts for client-side routing after hydration.
 * On web + onPress only: renders a native <button>.
 * On native: renders a regular Pressable.
 */
export function WebSafePressable({ href, onPress, children, style, disabled, ...rest }: Props) {
  if (Platform.OS === 'web') {
    // Flatten function-style style to a static one
    const flatStyle = typeof style === 'function' ? style({ pressed: false, hovered: false, focused: false } as any) : style;

    const baseStyle = {
      background: 'transparent',
      border: 'none',
      padding: 0,
      margin: 0,
      cursor: disabled ? 'default' : 'pointer',
      width: '100%',
      display: 'block',
      textDecoration: 'none',
      ...(flatStyle as any),
    };

    if (href) {
      // <a> works even before React hydration — pure HTML navigation fallback
      const handleAnchorClick = (e: any) => {
        e?.preventDefault?.();
        if (disabled) return;
        try { onPress?.(); } catch (err) { console.error('[WebSafePressable] onPress error:', err); }
        try {
          router.push(href as any);
        } catch (err) {
          // Router not ready yet — fall back to full-page navigation
          window.location.assign(href);
        }
      };

      return React.createElement(
        'a',
        {
          href,
          onClick: handleAnchorClick,
          style: baseStyle,
        },
        children,
      );
    }

    // onPress-only: use <button>
    const handleButtonClick = (e: any) => {
      e?.preventDefault?.();
      if (disabled) return;
      try { onPress?.(); } catch (err) { console.error('[WebSafePressable] onPress error:', err); }
    };

    return React.createElement(
      'button',
      {
        type: 'button',
        onClick: handleButtonClick,
        disabled: !!disabled,
        style: baseStyle,
      },
      children,
    );
  }

  return (
    <Pressable onPress={disabled ? undefined : onPress} style={style} {...rest}>
      {children}
    </Pressable>
  );
}
