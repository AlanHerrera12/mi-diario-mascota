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
 * On web: renders a native HTML <button> (zero-styling) so that
 * onClick is guaranteed to fire and href triggers window.location.
 *
 * On native: renders a regular Pressable.
 */
export function WebSafePressable({ href, onPress, children, style, ...rest }: Props) {
  if (Platform.OS === 'web') {
    // Flatten function-style style to a static one for the HTML button
    const flatStyle = typeof style === 'function' ? style({ pressed: false, hovered: false, focused: false } as any) : style;

    const handleClick = (e: any) => {
      e?.preventDefault?.();
      try { onPress?.(); } catch (err) { console.error('[WebSafePressable] onPress error:', err); }
      if (href) {
        console.log('[WebSafePressable] navigating →', href);
        try {
          router.push(href as any);
        } catch (err) {
          console.warn('[WebSafePressable] router.push failed, falling back to window.location:', err);
        }
        // Belt-and-suspenders: fall back to a hard navigation 50ms later if router didn't move
        setTimeout(() => {
          if (typeof window !== 'undefined' && !window.location.pathname.includes(href.replace(/^\/+/, '').split('/').pop() || '')) {
            window.location.assign(href);
          }
        }, 50);
      }
    };

    return React.createElement(
      'button',
      {
        type: 'button',
        onClick: handleClick,
        style: {
          background: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          width: '100%',
          display: 'block',
          textAlign: 'left',
          ...(flatStyle as any),
        },
      },
      children,
    );
  }

  return (
    <Pressable onPress={onPress} style={style} {...rest}>
      {children}
    </Pressable>
  );
}
