import { forwardRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = forwardRef<Editor, RichTextEditorProps>(({ value, onChange, placeholder }, ref) => {
  return (
    <Editor
      ref={ref}
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY} // 환경변수에서 API 키를 가져옵니다
      value={value}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'table | removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder: placeholder,
        language: 'ko_KR',
        language_url: '/langs/ko_KR.js' // 한글 언어 팩 URL
      }}
      onEditorChange={onChange}
    />
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor; 