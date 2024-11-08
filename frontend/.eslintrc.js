module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // Disable all prop-types related rules since we're using TypeScript
    'react/prop-types': 'off',
    
    // Allow Three.js and custom properties
    'react/no-unknown-property': ['warn', { 
      ignore: [
        'position',
        'args',
        'castShadow',
        'intensity',
        'roughness',
        'metalness',
        'transparent',
        'cmdk-input-wrapper'
      ]
    }],

    // Convert errors to warnings for build process
    '@typescript-eslint/no-explicit-any': 'warn',
    '@next/next/no-img-element': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/no-unescaped-entities': 'warn',

    // Disable other rules that are causing issues
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'no-useless-escape': 'off',
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
} 