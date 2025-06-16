export default function MessagesPage() {
  return (
    <main>
      <div>
        <h1>Messages</h1>
        <div
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "24px",
            backgroundColor: "white",
          }}
        >
          <div>
            <div
              style={{
                borderBottom: "1px solid #e1e1e1",
                paddingBottom: "16px",
              }}
            >
              <p>Your conversations will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
