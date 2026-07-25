import { useState } from 'react'
import { ImagePlus, Upload } from 'lucide-react'

interface Props {
  onImage: (dataUrl: string) => void
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsDataURL(file)
  })
}

/** Drag-and-drop / click-to-browse photo picker. */
export function UploadZone({ onImage }: Props): JSX.Element {
  const [drag, setDrag] = useState(false)

  const handleFiles = async (files: FileList | null): Promise<void> => {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    onImage(await fileToDataUrl(file))
  }

  const browse = async (): Promise<void> => {
    const dataUrl = await window.api.openImage()
    if (dataUrl) onImage(dataUrl)
  }

  return (
    <div
      className={`upload ${drag ? 'drag' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        void handleFiles(e.dataTransfer.files)
      }}
    >
      <ImagePlus size={40} strokeWidth={1.5} />
      <div>
        <h3>Drop a photo here</h3>
        <p>PNG, JPG or WEBP — a room, garden or house exterior</p>
      </div>
      <button className="btn btn-primary" onClick={browse}>
        <Upload size={16} /> Browse files
      </button>
    </div>
  )
}
