import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Eye } from 'lucide-react';

const SortableSection = ({ section, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSectionIcon = (type) => {
    const icons = {
      hero: '⭐',
      features: '🎯',
      about: '📖',
      contact: '📞',
      gallery: '🖼️',
      testimonials: '💬'
    };
    return icons[type] || '📄';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move hover:bg-gray-100 p-1 rounded"
          >
            <GripVertical size={20} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getSectionIcon(section.section_type)}</span>
            <div>
              <h4 className="font-semibold">{section.title || `${section.section_type} Section`}</h4>
              <p className="text-sm text-gray-500 capitalize">{section.section_type}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-blue-50 rounded text-blue-600 transition"
            title="Edit Section"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded text-red-600 transition"
            title="Delete Section"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Section Preview */}
      <div className="mt-3 ml-8 pl-2 border-l-2 border-gray-200">
        <div className="text-sm text-gray-600">
          {section.section_type === 'hero' && (
            <p>Headline: {section.content?.headline || 'Not set'}</p>
          )}
          {section.section_type === 'features' && (
            <p>{section.content?.items?.length || 0} features configured</p>
          )}
          {section.section_type === 'contact' && (
            <p>Email: {section.content?.email || 'Not set'}</p>
          )}
          {section.section_type === 'about' && (
            <p>{section.content?.description?.substring(0, 50) || 'No description'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortableSection;