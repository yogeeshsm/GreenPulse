
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, Loader2 } from 'lucide-react';

interface BarcodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: string) => void;
    onClose: () => void;
}

const BarcodeScanner = ({ onScanSuccess, onClose }: BarcodeScannerProps) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isStarting, setIsStarting] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasScanned = useRef(false);

    useEffect(() => {
        const formatsToSupport = [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.QR_CODE,
        ];

        const scanner = new Html5Qrcode("barcode-reader", {
            formatsToSupport,
            verbose: false,
        });
        scannerRef.current = scanner;

        scanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 280, height: 120 }, // Wide rectangle for barcodes
                aspectRatio: 1.5,
            },
            (decodedText) => {
                if (hasScanned.current) return;
                hasScanned.current = true;
                scanner.stop().catch(console.error);
                onScanSuccess(decodedText);
            },
            () => {
                // Ignore per-frame scan failures — this is normal
            }
        ).then(() => {
            setIsStarting(false);
        }).catch((err) => {
            setIsStarting(false);
            setError(`Camera error: ${err}. Please allow camera permissions.`);
        });

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="relative w-full max-w-md mx-auto">
            <div className="bg-black rounded-xl overflow-hidden relative">
                {/* Close button */}
                <button
                    onClick={() => {
                        if (scannerRef.current && scannerRef.current.isScanning) {
                            scannerRef.current.stop().catch(console.error);
                        }
                        onClose();
                    }}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Loading overlay */}
                {isStarting && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 gap-3">
                        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                        <p className="text-sm text-slate-400">Starting camera...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 gap-3 p-4">
                        <Camera className="w-8 h-8 text-red-400" />
                        <p className="text-sm text-red-400 text-center">{error}</p>
                    </div>
                )}

                {/* Scanner renders here */}
                <div id="barcode-reader" className="w-full min-h-[300px]" />
            </div>
            <p className="text-center text-xs text-slate-400 py-2 mt-1">
                Point your camera at a barcode (EAN, UPC, Code128, QR)
            </p>
        </div>
    );
};

export default BarcodeScanner;
