import style from './Header.module.css';

export default function Header({
  handleAllCats,
  handleLikedCats,
  renderedCats,
}: {
  handleAllCats: () => void;
  handleLikedCats: () => void;
  renderedCats: 'allCats' | 'likedCats';
}) {
  return (
    <header className={style.header}>
      <button
        type="button"
        className={`${style.button} ${renderedCats === 'allCats' ? style.button_active : ''}`}
        onClick={handleAllCats}
      >
        Все котятки
      </button>
      <button
        type="button"
        className={`${style.button} ${renderedCats === 'likedCats' ? style.button_active : ''}`}
        onClick={handleLikedCats}
      >
        Любимые котятки
      </button>
    </header>
  );
}
