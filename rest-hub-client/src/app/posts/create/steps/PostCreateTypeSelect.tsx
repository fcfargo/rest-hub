import styles from '@/styles/post/postCreateTypeSelect.module.css';

type Props = {
  nextStepToUpload: () => void;
  nextStepToDetails: () => void;
};

export default function PostCreateTypeSelect({ nextStepToUpload, nextStepToDetails }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>게시물 타입 선택</h2>
      </div>

      <div className={styles.body}>
        <button className={styles.uploadButton} onClick={nextStepToUpload}>
          미디어 업로드 게시물 작성
        </button>

        <button className={styles.textOnlyButton} onClick={nextStepToDetails}>
          텍스트 게시물 작성
        </button>
      </div>
    </div>
  );
}
