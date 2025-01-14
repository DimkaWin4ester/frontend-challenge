import { useState } from 'react';
import { Cat, switchLikeCat } from '../../store/cats/catsSlice';
import style from './Card.module.css';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';

export default function Card({ cat }: { cat: Cat }) {
  const dispatch = useDispatch<AppDispatch>();
  const [isOnMouseEnter, setIsOnMouseEnter] = useState<boolean>(false);

  const likeHandler = () => {
    dispatch(switchLikeCat(cat.id));
    
  };

  return (
    <article className={style.card} onMouseEnter={() => setIsOnMouseEnter(true)} onMouseLeave={() => setIsOnMouseEnter(false)}>
      <img src={cat.url} alt={cat.id} className={style.img}/>
      {isOnMouseEnter && (
        <button type="button" className={style.button} onClick={likeHandler}>
          {localStorage.getItem('likedCats')?.includes(cat.id) ? (
            <div className={style.img_liked}/>
          ) : (
            <div className={style.img_no_liked}/>
          )}
        </button>
      )}
    </article>
  );
}
