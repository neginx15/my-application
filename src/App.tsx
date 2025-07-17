import React, { useState } from 'react';
import { Heading } from './components/Heading';
import { Image } from './components/Image';
import { Button } from './components/Button';
import { Link } from './components/Link';
import { Paragraph } from './components/Paragraph';
import { Dropdown } from './components/Dropdown';
import './App.css';

interface EditorElement {
  id: string;
  type: 'heading' | 'image' | 'button' | 'link' | 'paragraph';
  props: {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    text?: string;
    url?: string;
    variant?: 'default' | 'button' | 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    width?: number;
    height?: number;
  };
}

const headingLevelOptions = [
  { value: 1, label: 'Heading 1' },
  { value: 2, label: 'Heading 2' },
  { value: 3, label: 'Heading 3' },
  { value: 4, label: 'Heading 4' },
  { value: 5, label: 'Heading 5' },
  { value: 6, label: 'Heading 6' },
];

const App: React.FC = () => {
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editLevel, setEditLevel] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const addElement = (type: 'heading' | 'image' | 'button' | 'link' | 'paragraph') => {
    const newElement: EditorElement = {
      id: Date.now().toString(),
      type,
      props: type === 'heading' 
        ? { level: 1, text: 'New Heading' }
        : type === 'image'
        ? { width: 300, height: 200 }
        : type === 'button'
        ? { text: 'New Button', variant: 'primary', size: 'medium' }
        : type === 'link'
        ? { text: 'New Link', url: '#', variant: 'default' }
        : type === 'paragraph'
        ? { text: 'New Paragraph' }
        : {}
    };
    setElements([...elements, newElement]);
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(element => element.id !== id));
  };

  const startEditing = (element: EditorElement) => {
    setEditingId(element.id);
    if (element.type === 'heading') {
      setEditText(element.props.text === 'New Heading' ? '' : (element.props.text || ''));
      setEditLevel(element.props.level || 1);
    } else if (element.type === 'button') {
      setEditText(element.props.text === 'New Button' ? '' : (element.props.text || ''));
    } else if (element.type === 'link') {
      setEditText(element.props.text === 'New Link' ? '' : (element.props.text || ''));
      setEditUrl(element.props.url === '#' ? '' : (element.props.url || ''));
    } else if (element.type === 'paragraph') {
      setEditText(element.props.text === 'New Paragraph' ? '' : (element.props.text || ''));
    }
  };

  const saveEdit = () => {
    if (editingId) {
      setElements(elements.map(element => 
        element.id === editingId
          ? { 
              ...element, 
              props: { 
                ...element.props, 
                text: editText,
                ...(element.type === 'link' ? { url: editUrl } : {}),
                ...(element.type === 'heading' ? { level: editLevel } : {})
              } 
            }
          : element
      ));
      setEditingId(null);
      setEditText('');
      setEditUrl('');
      setEditLevel(1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
      setEditUrl('');
      setEditLevel(1);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = elements.findIndex(el => el.id === draggedId);
    const targetIndex = elements.findIndex(el => el.id === targetId);
    
    const newElements = [...elements];
    const [draggedElement] = newElements.splice(draggedIndex, 1);
    newElements.splice(targetIndex, 0, draggedElement);
    
    setElements(newElements);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Components</h2>
        <div className="component-list">
          <button 
            className="component-item"
            onClick={() => addElement('heading')}
          >
            Add Heading
          </button>
          <button 
            className="component-item"
            onClick={() => addElement('image')}
          >
            Add Image
          </button>
          <button 
            className="component-item"
            onClick={() => addElement('button')}
          >
            Add Button
          </button>
          <button 
            className="component-item"
            onClick={() => addElement('link')}
          >
            Add Link
          </button>
          <button 
            className="component-item"
            onClick={() => addElement('paragraph')}
          >
            Add Paragraph
          </button>
        </div>
      </div>
      
      <div className="editor">
        <h2>Editor</h2>
        <div className="editor-content">
          {elements.map((element) => (
            <div 
              key={element.id} 
              className="editor-element"
              draggable
              onDragStart={(e) => handleDragStart(e, element.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, element.id)}
            >
              <div className="drag-handle">⋮⋮</div>
              <div className="editor-element-content">
                {element.type === 'heading' ? (
                  editingId === element.id ? (
                    <div className="edit-container">
                      <div className="heading-edit-controls"                  >
                        <Dropdown
                          options={headingLevelOptions}
                          onClick={saveEdit}
                          value={editLevel}
                          onChange={ (value) => setEditLevel(value as 1 | 2 | 3 | 4 | 5 | 6)}
                          className="level-dropdown"
                        />
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={handleKeyPress}
                          autoFocus
                          className="edit-input"
                          placeholder="Heading text"
                        />
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => startEditing(element)}
                      className="editable-component"
                    >
                      <Heading 
                        level={element.props.level || 1} 
                        text={element.props.text || ''} 
                      />
                    </div>
                  )
                ) : element.type === 'image' ? (
                  <div className="image-container">
                    <Image 
                      width={element.props.width} 
                      height={element.props.height} 
                    />
                  </div>
                ) : element.type === 'button' ? (
                  editingId === element.id ? (
                    <div className="edit-container">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="edit-input"
                        placeholder="Button text"
                      />
                    </div>
                  ) : (
                    <div 
                      onClick={() => startEditing(element)}
                      className="editable-component"
                    >
                      <Button 
                        text={element.props.text || ''}
                        variant={element.props.variant as 'primary' | 'secondary' | 'outline'}
                        size={element.props.size as 'small' | 'medium' | 'large'}
                      />
                    </div>
                  )
                ) : element.type === 'link' ? (
                  editingId === element.id ? (
                    <div className="edit-container">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyPress}
                        className="edit-input"
                        placeholder="Link text"
                      />
                      <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyPress}
                        className="edit-input"
                        placeholder="URL"
                      />
                    </div>
                  ) : (
                    <div 
                      onClick={() => startEditing(element)}
                      className="editable-component"
                    >
                      <Link 
                        text={element.props.text || ''}
                        url={element.props.url || ''}
                        variant={element.props.variant as 'default' | 'button'}
                      />
                    </div>
                  )
                ) : element.type === 'paragraph' ? (
                  editingId === element.id ? (
                    <div className="edit-container">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="edit-input paragraph-edit"
                        placeholder="Paragraph text"
                      />
                    </div>
                  ) : (
                    <div 
                      onClick={() => startEditing(element)}
                      className="editable-component"
                    >
                      <Paragraph text={element.props.text || ''} />
                    </div>
                  )
                ) : null}
              </div>
              <button 
                className="delete-button"
                onClick={() => deleteElement(element.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;