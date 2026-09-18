import { useState, type ChangeEvent } from 'react';

export default function App() {
  // Tipamos os estados para aceitar File/string ou null
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Tipamos o evento do input como ChangeEvent<HTMLInputElement>
  function aoSelecionarArquivo(event: ChangeEvent<HTMLInputElement>) {
    const arquivoSelecionado = event.target.files?.[0];

    if (arquivoSelecionado) {
      setArquivo(arquivoSelecionado);
      setPreview(URL.createObjectURL(arquivoSelecionado));
    }
  }

  function limpar() {
    setArquivo(null);
    setPreview(null);
  }

  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
        <h2>Upload de Arquivo (SCRUM-23)</h2>

        <input
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            onChange={aoSelecionarArquivo}
        />

        {preview && (
            <div style={{ marginTop: '20px' }}>
              <h3>Preview:</h3>

              {arquivo?.type.startsWith('image/') && (
                  <img src={preview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              )}

              {arquivo?.type === 'application/pdf' && (
                  <iframe src={preview} title="PDF Preview" style={{ width: '100%', height: '400px' }} />
              )}

              <br />
              <button onClick={limpar} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
                Remover / Trocar Arquivo
              </button>
            </div>
        )}
      </div>
  );
}