"use client"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside 
      className="flex flex-col h-screen"
      style={{
        width: "260px",
        background: "rgba(37, 37, 38, 1)",
        borderRight: "1px solid rgba(58, 58, 58, 1)",
      }}
    >
      {/* Logo Section */}
      <div 
        data-testid="logo"
        style={{
          display: "flex",
          position: "static",
          width: "259px",
          height: "55px",
          minHeight: "55px",
          padding: "17px 30px 0px",
          boxSizing: "border-box",
          justifyContent: "space-between",
          color: "rgba(255, 255, 255, 0.92)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple Color Emoji', 'SF Pro', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        <a 
          href="#"
          aria-label="Apple Music"
          role="img"
          onClick={(e) => e.preventDefault()}
          style={{
            display: "block",
            position: "relative",
            width: "83px",
            height: "38px",
            cursor: "pointer",
          }}
        >
          <svg height="20" viewBox="0 0 83 20" width="83" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: "inline", width: "83px", height: "20px", overflow: "hidden" }}>
            <path fill="white" d="M34.752 19.746V6.243h-.088l-5.433 13.503h-2.074L21.711 6.243h-.087v13.503h-2.548V1.399h3.235l5.833 14.621h.1l5.82-14.62h3.248v18.347h-2.56zm16.649 0h-2.586v-2.263h-.062c-.725 1.602-2.061 2.504-4.072 2.504-2.86 0-4.61-1.894-4.61-4.958V6.37h2.698v8.125c0 2.034.95 3.127 2.81 3.127 1.95 0 3.124-1.373 3.124-3.458V6.37H51.4v13.376zm7.394-13.618c3.06 0 5.046 1.73 5.134 4.196h-2.536c-.15-1.296-1.087-2.11-2.598-2.11-1.462 0-2.436.724-2.436 1.793 0 .839.6 1.41 2.023 1.741l2.136.496c2.686.636 3.71 1.704 3.71 3.636 0 2.442-2.236 4.12-5.333 4.12-3.285 0-5.26-1.64-5.509-4.183h2.673c.25 1.398 1.187 2.085 2.836 2.085 1.623 0 2.623-.687 2.623-1.78 0-.865-.487-1.373-1.924-1.704l-2.136-.508c-2.498-.585-3.735-1.806-3.735-3.75 0-2.391 2.049-4.032 5.072-4.032zM66.1 2.836c0-.878.7-1.577 1.561-1.577.862 0 1.55.7 1.55 1.577 0 .864-.688 1.576-1.55 1.576a1.573 1.573 0 0 1-1.56-1.576zm.212 3.534h2.698v13.376h-2.698zm14.089 4.603c-.275-1.424-1.324-2.556-3.085-2.556-2.086 0-3.46 1.767-3.46 4.64 0 2.938 1.386 4.642 3.485 4.642 1.66 0 2.748-.928 3.06-2.48H83C82.713 18.067 80.477 20 77.317 20c-3.76 0-6.208-2.62-6.208-6.942 0-4.247 2.448-6.93 6.183-6.93 3.385 0 5.446 2.213 5.683 4.845h-2.573zM10.824 3.189c-.698.834-1.805 1.496-2.913 1.398-.145-1.128.41-2.33 1.036-3.065C9.644.662 10.848.05 11.835 0c.121 1.178-.336 2.33-1.01 3.19zm.999 1.619c.624.049 2.425.244 3.578 1.98-.096.074-2.137 1.272-2.113 3.79.024 3.01 2.593 4.012 2.617 4.037-.024.074-.407 1.419-1.344 2.812-.817 1.224-1.657 2.422-3.002 2.447-1.297.024-1.73-.783-3.218-.783-1.489 0-1.97.758-3.194.807-1.297.048-2.28-1.297-3.097-2.52C.368 14.908-.904 10.408.825 7.375c.84-1.516 2.377-2.47 4.034-2.495 1.273-.023 2.45.857 3.218.857.769 0 2.137-1.027 3.746-.93z" />
          </svg>
        </a>
      </div>

      {/* Scrollable Container */}
      <div 
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple Color Emoji', 'SF Pro', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        {/* Primary Navigation Items */}
        <nav data-testid="navigation-items-primary" style={{ paddingTop: "9px" }}>
          <ul style={{ padding: "0px 25px 9px", margin: 0, listStyle: "none" }}>
            {/* Home Item */}
            <li 
              data-testid="navigation-item"
              aria-selected={currentPage === "home"}
              style={{
                position: "relative",
                marginBottom: "2px",
                padding: "4px",
                borderRadius: "6px",
                background: currentPage === "home" ? "rgba(235, 235, 245, 0.1)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <button
                onClick={() => onNavigate("home")}
                data-testid="home"
                aria-pressed={currentPage === "home"}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  padding: "3px",
                  margin: "-3px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "rgba(255, 255, 255, 0.92)",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                  <span style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ overflow: "hidden" }}>
                      <path fill="currentColor" d="M5.93 20.16a1.94 1.94 0 0 1-1.43-.502c-.334-.335-.502-.794-.502-1.393v-7.142c0-.362.062-.688.177-.953.123-.264.326-.529.6-.75l6.145-5.157c.176-.141.344-.247.52-.318.176-.07.362-.105.564-.105.194 0 .388.035.565.105.176.07.352.177.52.318l6.146 5.158c.273.23.467.476.59.75.124.264.177.59.177.96v7.134c0 .59-.159 1.058-.503 1.393-.335.335-.811.503-1.428.503H5.929Zm12.14-1.172c.221 0 .406-.07.547-.212a.688.688 0 0 0 .22-.511v-7.142c0-.177-.026-.344-.087-.459a.97.97 0 0 0-.265-.353l-6.154-5.149a.756.756 0 0 0-.177-.115.37.37 0 0 0-.15-.035.37.37 0 0 0-.158.035l-.177.115-6.145 5.15a.982.982 0 0 0-.274.352 1.13 1.13 0 0 0-.088.468v7.133c0 .203.08.379.23.511a.744.744 0 0 0 .546.212h12.133Zm-8.323-4.7c0-.176.062-.326.177-.432a.6.6 0 0 1 .423-.159h3.315c.176 0 .326.053.432.16s.159.255.159.431v4.973H9.756v-4.973Z" />
                    </svg>
                  </span>
                  <span style={{ 
                    flex: 1, 
                    marginLeft: "12px",
                    fontSize: "15px", 
                    fontWeight: currentPage === "home" ? 500 : 400,
                    lineHeight: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "left"
                  }}>Home</span>
                </div>
              </button>
            </li>

            {/* New Item */}
            <li 
              data-testid="navigation-item"
              aria-selected={currentPage === "new"}
              style={{
                position: "relative",
                marginBottom: "2px",
                padding: "4px",
                borderRadius: "6px",
                background: currentPage === "new" ? "rgba(235, 235, 245, 0.1)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <button
                onClick={() => onNavigate("new")}
                data-testid="new"
                aria-pressed={currentPage === "new"}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  padding: "3px",
                  margin: "-3px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "rgba(255, 255, 255, 0.92)",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                  <span style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg height="24" viewBox="0 0 24 24" width="24" aria-hidden="true" style={{ overflow: "hidden" }}>
                      <path fill="currentColor" fillOpacity=".95" d="M9.92 11.354c.966 0 1.453-.487 1.453-1.49v-3.4c0-1.004-.487-1.483-1.453-1.483H6.452C5.487 4.981 5 5.46 5 6.464v3.4c0 1.003.487 1.49 1.452 1.49zm7.628 0c.965 0 1.452-.487 1.452-1.49v-3.4c0-1.004-.487-1.483-1.452-1.483h-3.46c-.974 0-1.46.479-1.46 1.483v3.4c0 1.003.486 1.49 1.46 1.49zm-7.65-1.073h-3.43c-.266 0-.396-.137-.396-.418v-3.4c0-.273.13-.41.396-.41h3.43c.265 0 .402.137.402.41v3.4c0 .281-.137.418-.403.418zm7.634 0h-3.43c-.273 0-.402-.137-.402-.418v-3.4c0-.273.129-.41.403-.41h3.43c.265 0 .395.137.395.41v3.4c0 .281-.13.418-.396.418zm-7.612 8.7c.966 0 1.453-.48 1.453-1.483v-3.407c0-.996-.487-1.483-1.453-1.483H6.452c-.965 0-1.452.487-1.452 1.483v3.407c0 1.004.487 1.483 1.452 1.483zm7.628 0c.965 0 1.452-.48 1.452-1.483v-3.407c0-.996-.487-1.483-1.452-1.483h-3.46c-.974 0-1.46.487-1.46 1.483v3.407c0 1.004.486 1.483 1.46 1.483zm-7.65-1.072h-3.43c-.266 0-.396-.137-.396-.41v-3.4c0-.282.13-.418.396-.418h3.43c.265 0 .402.136.402.418v3.4c0 .273-.137.41-.403.41zm7.634 0h-3.43c-.273 0-.402-.137-.402-.41v-3.4c0-.282.129-.418.403-.418h3.43c.265 0 .395.136.395.418v3.4c0 .273-.13.41-.396.41z" />
                    </svg>
                  </span>
                  <span style={{ 
                    flex: 1, 
                    marginLeft: "12px",
                    fontSize: "15px", 
                    fontWeight: currentPage === "new" ? 500 : 400,
                    lineHeight: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "left"
                  }}>New</span>
                </div>
              </button>
            </li>

            {/* Movies Item */}
            <li 
              data-testid="navigation-item"
              aria-selected={currentPage === "movies"}
              style={{
                position: "relative",
                marginBottom: "2px",
                padding: "4px",
                borderRadius: "6px",
                background: currentPage === "movies" ? "rgba(235, 235, 245, 0.1)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <button
                onClick={() => onNavigate("movies")}
                data-testid="movies"
                aria-pressed={currentPage === "movies"}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  padding: "3px",
                  margin: "-3px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "rgba(255, 255, 255, 0.92)",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                  <span style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ overflow: "hidden" }}>
                      <path fill="currentColor" d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H3c-1.1 0-1.99.9-1.99 2L1 18c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V4h-5zM3 6.5L4.5 8H3V6.5zM21 18H3V10h18v8z"/>
                    </svg>
                  </span>
                  <span style={{ 
                    flex: 1, 
                    marginLeft: "12px",
                    fontSize: "15px", 
                    fontWeight: currentPage === "movies" ? 500 : 400,
                    lineHeight: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "left"
                  }}>Movies</span>
                </div>
              </button>
            </li>

            {/* Radio Item */}
            <li 
              data-testid="navigation-item"
              aria-selected={currentPage === "radio"}
              style={{
                position: "relative",
                marginBottom: "1px",
                padding: "4px",
                borderRadius: "6px",
                background: currentPage === "radio" ? "rgba(235, 235, 245, 0.1)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <button
                onClick={() => onNavigate("radio")}
                data-testid="radio"
                aria-pressed={currentPage === "radio"}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  padding: "3px",
                  margin: "-3px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "rgba(255, 255, 255, 0.92)",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                  <span style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ overflow: "hidden" }}>
                      <path fill="currentColor" d="M19.359 18.57C21.033 16.818 22 14.461 22 11.89s-.967-4.93-2.641-6.68c-.276-.292-.653-.26-.868-.023-.222.246-.176.591.085.868 1.466 1.535 2.272 3.593 2.272 5.835 0 2.241-.806 4.3-2.272 5.835-.261.268-.307.621-.085.86.215.245.592.276.868-.016zm-13.85.014c.222-.238.176-.59-.085-.86-1.474-1.535-2.272-3.593-2.272-5.834 0-2.242.798-4.3 2.272-5.835.261-.277.307-.622.085-.868-.215-.238-.592-.269-.868.023C2.967 6.96 2 9.318 2 11.89s.967 4.929 2.641 6.68c.276.29.653.26.868.014zm1.957-1.873c.223-.253.162-.583-.1-.867-.951-1.068-1.473-2.45-1.473-3.954 0-1.505.522-2.887 1.474-3.954.26-.284.322-.614.1-.876-.23-.26-.622-.26-.891.039-1.175 1.274-1.827 2.963-1.827 4.79 0 1.82.652 3.517 1.827 4.784.269.3.66.307.89.038zm9.958-.038c1.175-1.267 1.827-2.964 1.827-4.783 0-1.828-.652-3.517-1.827-4.791-.269-.3-.66-.3-.89-.039-.23.262-.162.592.092.876.96 1.067 1.481 2.449 1.481 3.954 0 1.504-.522 2.886-1.481 3.954-.254.284-.323.614-.092.867.23.269.621.261.89-.038zm-8.061-1.966c.23-.26.13-.568-.092-.883-.415-.522-.63-1.197-.63-1.934 0-.737.215-1.413.63-1.943.222-.307.322-.614.092-.875s-.653-.261-.906.054a4.385 4.385 0 0 0-.968 2.764 4.38 4.38 0 0 0 .968 2.756c.253.322.675.322.906.061zm6.18-.061a4.38 4.38 0 0 0 .968-2.756 4.385 4.385 0 0 0-.968-2.764c-.253-.315-.675-.315-.906-.054-.23.261-.138.568.092.875.415.53.63 1.206.63 1.943 0 .737-.215 1.412-.63 1.934-.23.315-.322.622-.092.883s.653.261.906-.061zm-3.547-.967c.96 0 1.789-.814 1.789-1.797s-.83-1.789-1.789-1.789c-.96 0-1.781.806-1.781 1.789 0 .983.821 1.797 1.781 1.797z" />
                    </svg>
                  </span>
                  <span style={{ 
                    flex: 1, 
                    marginLeft: "12px",
                    fontSize: "15px", 
                    fontWeight: currentPage === "radio" ? 500 : 400,
                    lineHeight: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "left"
                  }}>Radio</span>
                </div>
              </button>
            </li>

            {/* Search Item */}
            <li 
              data-testid="navigation-item"
              aria-selected={false}
              style={{
                position: "relative",
                marginBottom: "1px",
                padding: "4px",
                borderRadius: "6px",
                transition: "all 0.2s",
              }}
            >
              <button
                data-testid="search"
                aria-pressed={false}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  padding: "3px",
                  margin: "-3px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "rgba(255, 255, 255, 0.92)",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                  <span style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg height="24" viewBox="0 0 24 24" width="24" aria-hidden="true" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                      <path fill="currentColor" fillOpacity=".95" d="M17.979 18.553c.476 0 .813-.366.813-.835a.807.807 0 0 0-.235-.586l-3.45-3.457a5.61 5.61 0 0 0 1.158-3.413c0-3.098-2.535-5.633-5.633-5.633C7.542 4.63 5 7.156 5 10.262c0 3.098 2.534 5.632 5.632 5.632a5.614 5.614 0 0 0 3.274-1.055l3.472 3.472a.835.835 0 0 0 .6.242zm-7.347-3.875c-2.417 0-4.416-2-4.416-4.416 0-2.417 2-4.417 4.416-4.417 2.417 0 4.417 2 4.417 4.417s-2 4.416-4.417 4.416z" />
                    </svg>
                  </span>
                  <span style={{ 
                    flex: 1, 
                    marginLeft: "12px",
                    fontSize: "15px", 
                    fontWeight: 400,
                    lineHeight: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "left"
                  }}>Search</span>
                </div>
              </button>
            </li>
          </ul>
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Native CTA Section */}
        <div style={{ borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}>
          <div data-testid="native-cta" style={{ padding: "16px 25px" }}>
            <button 
              data-testid="native-cta-button"
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "flex-start",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "rgba(255, 255, 255, 0.92)",
                fontFamily: "inherit",
                transition: "opacity 0.2s",
              }}
            >
              <span style={{ flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ margin: "0px 8px 0px 5px" }}>
                  <path fill="white" d="M22.567 1.496C21.448.393 19.956.045 17.293.045H6.566c-2.508 0-4.028.376-5.12 1.465C.344 2.601 0 4.09 0 6.611v10.727c0 2.695.33 4.18 1.432 5.257 1.106 1.103 2.595 1.45 5.275 1.45h10.586c2.663 0 4.169-.347 5.274-1.45C23.656 21.504 24 20.033 24 17.338V6.752c0-2.694-.344-4.179-1.433-5.256Zm.411 4.9v11.299c0 1.898-.338 3.286-1.188 4.137-.851.864-2.256 1.191-4.141 1.191H6.35c-1.884 0-3.303-.341-4.154-1.191-.85-.851-1.174-2.239-1.174-4.137V6.54c0-2.014.324-3.445 1.16-4.295.851-.864 2.312-1.177 4.313-1.177h11.154c1.885 0 3.29.341 4.141 1.191.864.85 1.188 2.239 1.188 4.137Z" />
                  <path fill="white" d="M7.413 19.255c.987 0 2.48-.728 2.48-2.672v-6.385c0-.35.063-.428.378-.494l5.298-1.095c.351-.067.534.025.534.333l.035 4.286c0 .337-.182.586-.53.652l-1.014.228c-1.361.3-2.007.923-2.007 1.937 0 1.017.79 1.748 1.926 1.748.986 0 2.444-.679 2.444-2.64V5.654c0-.636-.279-.821-1.016-.66L9.646 6.298c-.448.091-.674.329-.674.699l.035 7.697c0 .336-.148.546-.446.613l-1.067.21c-1.329.266-1.986.93-1.986 1.993 0 1.017.786 1.745 1.905 1.745Z" />
                </svg>
              </span>
              <span style={{ 
                flex: 1, 
                fontSize: "13px", 
                lineHeight: "16px",
                color: "rgba(255, 255, 255, 0.64)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textAlign: "left"
              }}>Open in Music</span>
              <span style={{ flexShrink: 0 }}>
                <svg height="16" width="16" viewBox="0 0 16 16" aria-hidden="true" style={{ width: "9px", height: "9px", margin: "0px 4px", opacity: 0.6 }}>
                  <path fill="white" d="M1.559 16 13.795 3.764v8.962H16V0H3.274v2.205h8.962L0 14.441 1.559 16z" />
                </svg>
              </span>
            </button>
          </div>
          
          <button 
            data-testid="try-beta"
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0px 25px 13px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255, 255, 255, 0.64)",
              fontFamily: "inherit",
              fontSize: "13px",
              lineHeight: "18px",
              transition: "opacity 0.2s",
            }}
          >
            <span>Try Beta</span>
            <span style={{ marginLeft: "auto" }}>
              <svg height="16" width="16" viewBox="0 0 16 16" aria-hidden="true" style={{ width: "9px", height: "9px", margin: "0px 4px", opacity: 0.6 }}>
                <path fill="white" d="M1.559 16 13.795 3.764v8.962H16V0H3.274v2.205h8.962L0 14.441 1.559 16z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
