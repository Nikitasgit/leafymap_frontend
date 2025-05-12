import styles from "../../styles/styles.scss";

export default function MessagesPage() {
  return (
    <main className={styles.container}>
      <div className="text-center">
        <h1 className={styles["mb-4"]}>Messages</h1>
        <div
          className={styles["bg-white"]}
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "24px",
          }}
        >
          <div className={styles["space-y-4"]}>
            <div
              style={{
                borderBottom: "1px solid #e1e1e1",
                paddingBottom: "16px",
              }}
            >
              <p className={styles["text-gray"]}>
                Your conversations will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
