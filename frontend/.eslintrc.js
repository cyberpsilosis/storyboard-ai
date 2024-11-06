module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // Disable the no-empty-interface rule
    '@typescript-eslint/no-empty-interface': 'off',
    // Allow empty arrow functions
    '@typescript-eslint/no-empty-function': 'off',
    // Allow any for now (you might want to fix these gradually)
    '@typescript-eslint/no-explicit-any': 'warn',
    // Disable inferrable types error
    '@typescript-eslint/no-inferrable-types': 'off',
    // Disable unused vars warning for type definitions
    '@typescript-eslint/no-unused-vars': ['warn', { 
      'varsIgnorePattern': '^_',
      'argsIgnorePattern': '^_'
    }],
    // Disable react-refresh warnings
    'react-refresh/only-export-components': 'off',
    // Disable no-useless-escape
    'no-useless-escape': 'off',
    // Ensure React is in scope
    'react/react-in-jsx-scope': 'off',
    // Configure exhaustive-deps as warning instead of error
    'react-hooks/exhaustive-deps': 'warn',
    // Allow Three.js props
    'react/no-unknown-property': ['error', { 
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
    // Disable prop-types since we're using TypeScript
    'react/prop-types': 'off',
    // Allow unescaped entities
    'react/no-unescaped-entities': 'off',
    // Convert img element warning to error to enforce Next/Image
    '@next/next/no-img-element': 'error'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
} 