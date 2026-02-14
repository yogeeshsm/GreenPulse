
import { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
    onImageSelected: (base64Image: string) => void;
    isLoading: boolean;
}

const ImageUploader = ({ onImageSelected, isLoading }: ImageUploaderProps) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [cameraMode, setCameraMode] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Start camera stream when cameraMode turns on
    useEffect(() => {
        if (cameraMode) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(() => {
                    alert('Camera access denied. Please allow camera permissions in your browser.');
                    setCameraMode(false);
                });
        }
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
        };
    }, [cameraMode]);

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const base64 = canvas.toDataURL('image/jpeg', 0.9);
            setPreview(base64);
            onImageSelected(base64);
            setCameraMode(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPreview(base64);
            onImageSelected(base64);
        };
        reader.readAsDataURL(file);
    };

    // CAMERA MODE — live viewfinder + capture
    if (cameraMode) {
        return (
            <div className="w-full space-y-3">
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-teal-500/30">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex justify-center gap-3">
                    <Button
                        onClick={() => setCameraMode(false)}
                        variant="outline"
                        className="border-slate-600 text-slate-400 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={capturePhoto}
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold px-8"
                    >
                        <Camera className="w-4 h-4 mr-2" />
                        Capture
                    </Button>
                </div>
            </div>
        );
    }

    // PREVIEW MODE — after photo taken or file uploaded
    if (preview) {
        return (
            <div className="w-full space-y-3">
                <div className="relative w-full aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col gap-3">
                            <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
                            <p className="text-teal-400 font-medium animate-pulse">Analyzing Product...</p>
                        </div>
                    )}
                </div>
                {!isLoading && (
                    <div className="flex justify-center">
                        <Button variant="outline" onClick={() => setPreview(null)} className="text-slate-400 hover:text-white border-slate-600">
                            Scan Another
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    // DEFAULT — choose camera or upload
    return (
        <div className="w-full space-y-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setCameraMode(true)}
                    className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-700 rounded-xl hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                        <Camera className="w-6 h-6 text-slate-400 group-hover:text-teal-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-teal-400">Take Photo</span>
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-700 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-blue-400">Upload Image</span>
                </button>
            </div>
        </div>
    );
};

export default ImageUploader;
