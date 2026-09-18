import { useState, useRef, type ChangeEvent } from 'react';

export default function App() {
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [usandoCamera, setUsandoCamera] = useState(false);

    const inputArquivoRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    async function abrirCamera() {
        setUsandoCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch {
            alert('Não foi possível acessar a câmera. Verifique as permissões no navegador.');
            fecharCamera();
        }
    }

    function fecharCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setUsandoCamera(false);
    }

    function tirarFoto() {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const fotoArquivo = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' });
                        setArquivo(fotoArquivo);
                        setPreview(URL.createObjectURL(fotoArquivo));
                        fecharCamera();
                    }
                }, 'image/jpeg');
            }
        }
    }

    function aoSelecionarArquivo(event: ChangeEvent<HTMLInputElement>) {
        const arquivoSelecionado = event.target.files?.[0];
        if (arquivoSelecionado) {
            setArquivo(arquivoSelecionado);
            setPreview(URL.createObjectURL(arquivoSelecionado));
        }
    }

    function limpar() {
        setArquivo(null);
        if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
        if (inputArquivoRef.current) inputArquivoRef.current.value = '';
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Upload de Encaminhamento (SCRUM-23)</h2>

            <input
                type="file"
                ref={inputArquivoRef}
                style={{ display: 'none' }}
                accept="image/*,application/pdf"
                onChange={aoSelecionarArquivo}
            />

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {usandoCamera ? (
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', borderRadius: '8px', backgroundColor: '#000' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                            onClick={tirarFoto}
                            style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: '#16a34a',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            📸 Capturar Foto
                        </button>
                        <button
                            onClick={fecharCamera}
                            style={{
                                padding: '12px',
                                backgroundColor: '#dc2626',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : !preview ? (
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                        onClick={abrirCamera}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        📷 Usar Câmera
                    </button>

                    <button
                        onClick={() => inputArquivoRef.current?.click()}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#475569',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        📁 Escolher Arquivo (Galeria / PDF)
                    </button>
                </div>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    <h3>Preview:</h3>

                    {arquivo?.type.startsWith('image/') && (
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                    )}

                    {arquivo?.type === 'application/pdf' && (
                        <iframe
                            src={preview}
                            title="PDF Preview"
                            style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: '8px' }}
                        />
                    )}

                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                        <strong>Arquivo:</strong> {arquivo?.name}
                    </div>

                    <button
                        onClick={limpar}
                        style={{
                            marginTop: '15px',
                            padding: '10px 16px',
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            width: '100%',
                        }}
                    >
                        Remover / Trocar Arquivo
                    </button>
                </div>
            )}
        </div>
    );
}