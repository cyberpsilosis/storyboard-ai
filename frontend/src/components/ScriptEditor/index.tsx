import React from 'react'
import Editor from '@monaco-editor/react'
import { Button } from "@/components/ui/button"

interface ScriptEditorProps {
  initialContent?: string
  onChange?: (value: string | undefined) => void
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  initialContent = '',
  onChange,
}) => {
  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          defaultValue={initialContent}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset</Button>
        <Button>Generate Storyboard</Button>
      </div>
    </div>
  )
} 