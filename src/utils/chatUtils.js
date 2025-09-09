export const allQuickActions = {
  medoptimize: [
    {
      id: 1,
      text: 'I need help with medical bills',
      redirectUrl: null,
      category: 'financial',
    },
    {
      id: 2,
      text: 'How can I reduce my prescription costs?',
      redirectUrl: null,
      category: 'financial',
    },
    {
      id: 3,
      text: 'What insurance options cover my condition?',
      redirectUrl: null,
      category: 'financial',
    },
  ],
};

export const formatTime = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds 10 MB limit`,
    };
  }
  return { valid: true };
};

export const getPlaceholderText = (isConnected, attachmentCount) => {
  if (!isConnected) return 'Connecting to server...';
  if (attachmentCount > 0) return 'Add a message or send now';
  return 'Type your message...';
};

export const linkifyBotMessage = (text) => {
  const linkMap = {
    medoptimize: '/them',
  };

  const hasSession =
    typeof window !== 'undefined' && sessionStorage.getItem('access_token');

  const regex = new RegExp(
    `(\\*\\*(?:${Object.keys(linkMap).join('|')})\\*\\*|\\b(?:${Object.keys(linkMap).join('|')})\\b)`,
    'gi'
  );

  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    const isBold = part.startsWith('**') && part.endsWith('**');
    const cleanPart = isBold ? part.slice(2, -2) : part;
    const key = cleanPart.toLowerCase();

    if (linkMap[key]) {
      return (
        <a
          key={i}
          href={linkMap[key]}
          className="text-yellow-600 underline hover:text-yellow-800"
          {...(hasSession
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {isBold ? <strong>{cleanPart}</strong> : cleanPart}
        </a>
      );
    }

    return <span key={i}>{part}</span>;
  });
};

export const convertFilesToBase64 = async (files) => {
  return Promise.all(
    files.map(async (file) => {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          resolve({
            base64: reader.result.split(',')[1],
            filename: file.name,
            mimetype: file.type,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );
};

export const prepareMessageAttachments = async (attachments) => {
  try {
    const base64Files = await Promise.all(
      attachments.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            const fileData = {
              id: `file-${Date.now()}-${file.name}`,
              name: file.name,
              size: file.size,
              type: file.type,
              url: reader.result,
              base64: reader.result.split(',')[1],
            };
            resolve(fileData);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    return {
      messageAttachments: base64Files,
      filePayload: base64Files.length > 0 ? base64Files[0] : null,
    };
  } catch (error) {
    console.error('Error preparing files:', error);
    throw new Error('Failed to process file. Please try again.');
  }
};
