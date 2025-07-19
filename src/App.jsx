import { useState } from "react";
import "./App.css";

// 32種類の画像パターン
const patternImageNames = [
  "00.png",
  "01.png",
  "02.png",
  "03.png",
  "10.png",
  "11.png",
  "12.png",
  "13.png",
  "20.png",
  "21.png",
  "22.png",
  "23.png",
  "30.png",
  "31.png",
  "32.png",
  "33.png",
  "40.png",
  "41.png",
  "42.png",
  "43.png",
  "50.png",
  "51.png",
  "52.png",
  "53.png",
  "60.png",
  "61.png",
  "62.png",
  "63.png",
  "70.png",
  "71.png",
  "72.png",
  "73.png",
];
const unitPatterns = patternImageNames.map(
  (name) => `${import.meta.env.BASE_URL}assets/picts/${name}`
);

function App() {
  // 5x5グリッド（初期値はnull）
  // 各セル: { idx: パターン番号, angle: 回転角度 } or null
  const [grid, setGrid] = useState(
    Array(5)
      .fill()
      .map(() => Array(5).fill(null))
  );
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [selectedAngle, setSelectedAngle] = useState(0); // 0, 90, 180, 270
  const [savedImages, setSavedImages] = useState([]); // 最大3つ保存
  const [selectedSaveIdx, setSelectedSaveIdx] = useState(null); // 保存box選択

  // グリッドセルクリック時
  const handleCellClick = (row, col) => {
    const newGrid = grid.map((arr) => arr.slice());
    newGrid[row][col] = { idx: selectedUnit, angle: selectedAngle };
    setGrid(newGrid);
  };

  // 画像プレビュー（imgタグで表示）
  const renderPreview = (gridData) => (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "repeat(5, 44px)",
        gridTemplateColumns: "repeat(5, 44px)",
        gap: 4,
        background: "#fff",
        border: "2px solid #eee",
        width: 220,
        height: 220,
      }}
    >
      {gridData.flat().map((cell, i) => (
        <div key={i} style={{ width: 44, height: 44 }}>
          {cell !== null ? (
            <img
              src={unitPatterns[cell.idx]}
              alt={cell.idx}
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${cell.angle}deg)`,
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );

  // 保存boxに保存（新規or上書き）
  // 保存boxに保存（選択slotに新規or上書き）
  const handleSave = () => {
    if (selectedSaveIdx === null) return; // slot未選択なら何もしない
    const gridCopy = JSON.parse(JSON.stringify(grid));
    setSavedImages((prev) => {
      const newArr = prev.slice();
      newArr[selectedSaveIdx] = gridCopy;
      // 3つより多くならないように
      return newArr.slice(0, 3);
    });
  };

  // 保存boxから削除
  const handleRemoveSaved = (idx) => {
    setSavedImages(savedImages.filter((_, i) => i !== idx));
    if (selectedSaveIdx === idx) setSelectedSaveIdx(null);
    else if (selectedSaveIdx > idx) setSelectedSaveIdx(selectedSaveIdx - 1);
  };

  // 保存boxから編集（グリッドにロード）
  const handleEditSaved = (idx) => {
    setGrid(JSON.parse(JSON.stringify(savedImages[idx])));
    setSelectedSaveIdx(idx);
  };

  // 回転角度ボタン
  const angleOptions = [0, 90, 180, 270];

  return (
    <div
      className="quickpict-app"
      style={{
        fontFamily: "sans-serif",
        background: "#fafafa",
        minHeight: "100vh",
        padding: 0,
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>
          クイックピクト
        </h1>
        <div style={{ fontSize: "1rem", color: "#333", marginTop: 8 }}>
          Web上で32のユニットパターンを使って、ピクトグラムを作成することができる。
        </div>
      </header>
      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 0 0 0",
        }}
      >
        <section
          style={{
            minWidth: 320,
            display: "inline-block",
            verticalAlign: "top",
          }}
        >
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>
            ユニットパターン
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 60px)",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {unitPatterns.map((imgSrc, idx) => (
              <button
                key={idx}
                style={{
                  border:
                    selectedUnit === idx ? "2px solid #f00" : "1px solid #ccc",
                  background: "#fff",
                  padding: 0,
                  cursor: "pointer",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setSelectedUnit(idx)}
              >
                <img src={imgSrc} alt={idx} style={{ width: 54, height: 54 }} />
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>回転</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {angleOptions.map((angle) => (
              <button
                key={angle}
                style={{
                  padding: "6px 12px",
                  background: selectedAngle === angle ? "#1976d2" : "#eee",
                  color: selectedAngle === angle ? "#fff" : "#333",
                  border: "none",
                  borderRadius: 4,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAngle(angle)}
              >
                {angle}°
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>グリッド</div>
          <div
            style={{
              display: "grid",
              gridTemplateRows: "repeat(5, 60px)",
              gridTemplateColumns: "repeat(5, 60px)",
              gap: 4,
              background: "#fff",
              border: "2px solid #eee",
              width: 312,
              height: 312,
              marginBottom: 16,
            }}
          >
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={rIdx + "-" + cIdx}
                  style={{
                    width: 60,
                    height: 60,
                    border: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: cell !== null ? "#f5f5f5" : "#fff",
                  }}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                >
                  {cell !== null ? (
                    <img
                      src={unitPatterns[cell.idx]}
                      alt={cell.idx}
                      style={{
                        width: 54,
                        height: 54,
                        transform: `rotate(${cell.angle}deg)`,
                      }}
                    />
                  ) : null}
                </div>
              ))
            )}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              style={{
                padding: "8px 16px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontWeight: "bold",
                cursor: savedImages.length >= 3 ? "not-allowed" : "pointer",
                opacity: savedImages.length >= 3 ? 0.5 : 1,
                transition: "background 0.2s",
              }}
              onClick={handleSave}
              disabled={savedImages.length >= 3}
            >
              保存boxに移動
            </button>
            <button
              style={{
                padding: "8px 16px",
                background: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() =>
                setGrid(
                  Array(5)
                    .fill()
                    .map(() => Array(5).fill(null))
                )
              }
            >
              マスをクリア
            </button>
          </div>
        </section>
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: 12,
              color: "#222",
              fontSize: "1.1rem",
            }}
          >
            保存box（最大21）
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(7, 1fr)",
              gap: 16,
              maxWidth: 700,
              margin: "0 auto",
              paddingBottom: 8,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            {[...Array(21)].map((_, idx) => {
              const isSelected = selectedSaveIdx === idx;
              const isSaved = savedImages[idx] !== undefined;
              return (
                <div
                  key={idx}
                  style={{
                    border: isSelected ? "7px solid #1976d2" : "2px solid #ccc",
                    padding: isSelected ? 0 : 4,
                    position: "relative",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    background: isSelected ? "#e3f2fd" : "#fff",
                    width: 220,
                    height: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition:
                      "border 0.2s, padding 0.2s, width 0.2s, height 0.2s",
                  }}
                  onClick={() => setSelectedSaveIdx(idx)}
                >
                  {isSaved ? (
                    <>
                      {renderPreview(savedImages[idx])}
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          display: "flex",
                          gap: 2,
                        }}
                      >
                        <button
                          style={{
                            background: "#1976d2",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            fontSize: 12,
                            padding: "2px 6px",
                            cursor: "pointer",
                            marginRight: 2,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSaved(idx);
                          }}
                        >
                          編集
                        </button>
                        <button
                          style={{
                            background: "#f44336",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            fontSize: 12,
                            padding: "2px 6px",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSaved(idx);
                          }}
                        >
                          削除
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        width: 220,
                        height: 220,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#bbb",
                        fontSize: 16,
                        background: "#fff",
                      }}
                    >
                      空きスロット
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
