# To-Do List — BroadcastChannel Project

The **To-Do List** project is an interactive and collaborative task board where users can create groups (post-it notes) and manage individual tasks within them. Each group can contain multiple tasks that can be added, marked as completed, or removed.

The key highlight of this project is the **use of the BroadcastChannel API**, which allows **real-time synchronization** of actions — such as adding groups, creating tasks, or moving post-its — across multiple browser tabs or windows.

This feature simulates a **shared workspace**, where all connected clients stay updated simultaneously, without requiring a server or complex WebSocket setup.

## Main Features

- Create and organize task groups (colored post-its).  
- Add, complete, and delete individual tasks.  
- Custom color selection for each group.  
- Drag and drop functionality for repositioning post-its.  
- **Real-time synchronization via BroadcastChannel API.**  
- Smooth animations and transitions for user experience.  


## About the BroadcastChannel API

The **BroadcastChannel API** is a simple browser technology that enables communication between different browser contexts (tabs, windows, iframes) that share the same origin.

### How It Works
The BroadcastChannel is used to keep all task boards synchronized in real time.

Creating a channel:
This creates a shared communication channel identified by a name ("postit-board").
Any tab that uses the same channel name can send and receive messages.

```js
const channel = new BroadcastChannel("postit-board");
```

Sending messages:
```js
channel.postMessage({ type: "addGroup", name, color });
```

Receiving messages:
```js
channel.onmessage = (event) => {
  const data = event.data;
  console.log("Received:", data);
};
```

### Layout
<img width="1575" height="921" alt="image" src="https://github.com/user-attachments/assets/b54d60a8-18f4-411e-bd03-58047b3034d3" />
