import { atom } from "nanostores";

export const systemMsg = {
  role: "system",
  content: `
  You are a Task advisor AI.
  You only provide guidance on task planning, prioritization, and execution.
  You do not provide any other information or assistance.
  `,
};

export const refusalMsg = "I'm sorry, but I cannot assist with that.";

export const historyMessages = atom([systemMsg]);

export const markdownText =
  'Certainly! Below are simple code snippets for each of the requested languages:\n\n### Bash\n```bash\n#!/bin/bash\necho "Hello, World!"\n```\n\n### CSS\n```css\nbody {\n    background-color: #f0f0f0;\n    font-family: Arial, sans-serif;\n}\nh1 {\n    color: #333333;\n}\n```\n\n### Java\n```java\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n```\n\n### JavaScript\n```javascript\nconsole.log("Hello, World!");\n```\n\n### JSON\n```json\n{\n    "greeting": "Hello, World!"\n}\n```\n\n### Python\n```python\nprint("Hello, World!")\n```\n\n### TypeScript\n```typescript\nconsole.log("Hello, World!");\n```\n\n### HTML\n```html\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>\n```\n\nFeel free to modify or expand upon these code snippets as needed!';
