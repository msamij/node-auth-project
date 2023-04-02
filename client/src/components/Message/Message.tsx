import { useEffect } from 'react';
import './Message.css';

function Message(props: { message: string; updateMessageOnUI: () => void }) {
  useEffect(() => {
    setTimeout(() => {
      props.updateMessageOnUI();
    }, 5000);
  }, []);

  return <div className="message">{props.message}</div>;
}

export default Message;
