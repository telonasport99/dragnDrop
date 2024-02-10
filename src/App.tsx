import s from './App.module.css';
import { useState, DragEvent } from "react";

interface Item {
    id: number;
    title: string;
}

interface Board {
    id: number;
    title: string;
    items: Item[];
}

const App = () => {
    const [boards, setBoards] = useState<Board[]>([
        { id: 1, title: 'Users', items: [{ id: 1, title: 'vadim' }, { id: 2, title: 'katya' }] },
        { id: 2, title: 'Mentors', items: [{ id: 3, title: 'vadim' }, { id: 4, title: 'katya' }] }
    ]);
    const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);

    const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if ((e.target as HTMLDivElement).className === 'item') {
            (e.target as HTMLDivElement).style.boxShadow = '0 2px 3px gray';
        }
    };

    const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
        (e.target as HTMLDivElement).style.boxShadow = 'none';
    };

    const dragStartHandler = (board: Board, item: Item) => {
        setCurrentBoard(board);
        setCurrentItem(item);
    };

    const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
        (e.target as HTMLDivElement).style.boxShadow = 'none';
    };

    const dropHandler = (e: DragEvent<HTMLDivElement>, board: Board, item: Item) => {
        e.preventDefault();
        const currentIndex = currentBoard?.items.indexOf(currentItem!);
        if (currentIndex !== undefined && currentIndex !== -1) {
            currentBoard?.items.splice(currentIndex, 1);
        }
        const dropIndex = board.items.indexOf(item);
        board.items.splice(dropIndex + 1, 0, currentItem!);
        setBoards(boards.map(b => {
            if (b.id === board.id) {
                return board;
            }
            if (b.id === currentBoard?.id) {
                return currentBoard!;
            }
            return b;
        }));
    };

    const dropCardHandler = (board: Board) => {
        if (!board.items.includes(currentItem!)) {
            board.items.push(currentItem!);
        }
        const currentIndex = currentBoard?.items.indexOf(currentItem!);
        if (currentIndex !== undefined && currentIndex !== -1) {
            currentBoard?.items.splice(currentIndex, 1);
        }
        setBoards(boards.map(b => {
            if (b.id === board.id) {
                return board;
            }
            if (b.id === currentBoard?.id) {
                return currentBoard!;
            }
            return b;
        }));
    };

    return (
        <div className={s.wrap}>
            {boards.map(board =>
                <div className={s.board}
                     onDragOver={(e) => dragOverHandler(e)}
                     onDrop={() => dropCardHandler(board)}
                >
                    <div className={s.title}>{board.title}</div>
                    {board.items.map(item =>
                        <div onDragOver={(e) => dragOverHandler(e)}
                             onDragLeave={e => dragLeaveHandler(e)}
                             onDragStart={() => dragStartHandler(board, item)}
                             onDragEnd={(e) => dragEndHandler(e)}
                             onDrop={(e) => dropHandler(e, board, item)}
                             draggable={true} className={s.item}>{item.title}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
