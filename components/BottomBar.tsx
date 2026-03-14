"use client";

interface BottomBarProps {
  onCopy: () => void;
  onRecord: () => void;
}

export default function BottomBar({ onCopy, onRecord }: BottomBarProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.95) 30%, #000 100%)",
        paddingTop: 32,
        paddingLeft: 24,
        paddingRight: 16,
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {/* 클립보드 버튼 */}
        <div
          style={{
            width: 170,
            flexShrink: 0,
            padding: 1,
            borderRadius: 8,
            background: "linear-gradient(180deg, #FFF 0%, #BABABA 100%)",
            boxShadow: "2px 2px 4px 0 rgba(0,0,0,0.60)",
          }}
        >
          <button
            onClick={onCopy}
            style={{
              width: "100%",
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "linear-gradient(96deg, #FFF 0%, #CCC 100%)",
              border: "none",
              borderRadius: 7,
              color: "#181818",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#copy_shadow)">
                <path d="M21.0357 2C21.805 2 22.4286 2.6236 22.4286 3.39286V7.57143H26.6071C27.3764 7.57143 28 8.19503 28 8.96429V26.6071C28 27.3764 27.3764 28 26.6071 28H8.96429C8.19503 28 7.57143 27.3764 7.57143 26.6071V22.4286H3.39286C2.6236 22.4286 2 21.805 2 21.0357V3.39286C2 2.6236 2.6236 2 3.39286 2H21.0357ZM10.3571 25.2143H25.2143V10.3571H10.3571V25.2143ZM4.78571 19.6429H7.57143V8.96429C7.57143 8.19503 8.19503 7.57143 8.96429 7.57143H19.6429V4.78571H4.78571V19.6429Z" fill="#181818"/>
              </g>
              <defs>
                <filter id="copy_shadow" x="0" y="0" width="30" height="30" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="1"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.652212 0 0 0 0 0.652212 0 0 0 0 0.652212 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_copy"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_copy" result="shape"/>
                </filter>
              </defs>
            </svg>
            클립보드에 복사
          </button>
        </div>

        {/* 노션 버튼 */}
        <div
          style={{
            width: 170,
            flexShrink: 0,
            padding: 1,
            borderRadius: 8,
            background: "linear-gradient(180deg, #1EFF00 0%, #13A600 100%)",
            boxShadow: "2px 2px 4px 0 rgba(0,0,0,0.60)",
          }}
        >
          <button
            onClick={onRecord}
            style={{
              width: "100%",
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background:
                "linear-gradient(96deg, #B4FFAA 0%, #1EFF00 51.92%, #B4FFAA 100%)",
              border: "none",
              borderRadius: 7,
              color: "#181818",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <svg width="26" height="27" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#notion_shadow)">
                <path fillRule="evenodd" clipRule="evenodd" d="M18.6653 2.06199L3.63447 3.17219C2.42186 3.27704 2 4.06943 2 5.01909V21.4969C2 22.2366 2.26268 22.8695 2.89642 23.7154L6.42968 28.3097C7.01018 29.0494 7.53798 29.208 8.64628 29.1554L26.1012 28.0987C27.5771 27.9935 28 27.3063 28 26.1447V7.60703C28 7.0067 27.7629 6.83366 27.0647 6.32134L22.1469 2.8541C20.9862 2.0101 20.5116 1.90335 18.6653 2.06172V2.06199ZM9.04098 7.3036C7.61567 7.39949 7.29241 7.42122 6.48292 6.76303L4.42495 5.12612C4.21579 4.91423 4.32091 4.64993 4.8479 4.59723L19.2974 3.54135C20.5108 3.43541 21.1427 3.85836 21.6172 4.22779L24.0954 6.02335C24.2014 6.07687 24.4648 6.39279 24.1478 6.39279L9.22569 7.29111L9.04098 7.3036ZM7.37934 25.9864V10.2493C7.37934 9.56204 7.59041 9.24503 8.22225 9.19179L25.3613 8.18834C25.9426 8.13592 26.2053 8.50535 26.2053 9.19152V24.8237C26.2053 25.511 26.0993 26.0923 25.1505 26.1447L8.7495 27.0955C7.80066 27.1479 7.37961 26.832 7.37961 25.9864H7.37934ZM23.5692 11.093C23.6744 11.5684 23.5692 12.0438 23.0939 12.0981L22.3034 12.2548V23.8738C21.6169 24.2432 20.9851 24.4543 20.457 24.4543C19.613 24.4543 19.4022 24.19 18.7701 23.3984L13.6008 15.2654V23.1341L15.2361 23.5044C15.2361 23.5044 15.2361 24.4551 13.9167 24.4551L10.2794 24.6662C10.1735 24.4543 10.2794 23.9265 10.648 23.8214L11.5979 23.5579V13.154L10.2797 13.0472C10.1737 12.5718 10.4372 11.8854 11.1761 11.8322L15.0788 11.5695L20.4573 19.8076V12.5194L19.0863 12.3619C18.9804 11.7797 19.4022 11.3568 19.9292 11.3052L23.5692 11.093Z" fill="#181818"/>
              </g>
              <defs>
                <filter id="notion_shadow" x="0" y="0" width="30" height="31.1646" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="1"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.0926401 0 0 0 0 0.794058 0 0 0 0 0 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_notion"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_notion" result="shape"/>
                </filter>
              </defs>
            </svg>
            노션으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
