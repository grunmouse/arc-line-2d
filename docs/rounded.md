## Скругление ломаной

Дано:
- $q$ - количество звеньев ломаной;
- $P_{i},\, i \in [0, q]$ - точки;
- $a_{i},\, i \in [1, q]$ - длины рёбер.

Найти:
- $s_{i},\, i \in [0, q]$ - длины скругляемых частей при вершинах $i$;
- $p_{i},\, i \in [1, q]$ - длины нескругляемых частей отрезков $i$.

Ограничения:
$$s_0 = 0;\; s_n = 0;\; s_i \ge 0;\; p_i \ge 0.$$

Основное уравнение:
$$a_i = s_{i-1} + s_{i} + p_i.$$

Отсюда:
$$p_i = - s_{i-1} - s_{i} + a_i.$$

$$a_i - s_{i-1} - s_{i} \ge 0;$$
$$s_{i-1} + s_{i} \le a_i.$$

Целевая функция:
Будем минимизировать
$$f = \sum_{i=1}^q p_i.$$
или, что то же самое, максимизировать 
$$z = \sum_{i=1}^{q-1} s_i$$

Очевидно, что сумма всех длин должна совпадать:
$$f + 2z = \sum_{i=1}^q a_i.$$

В случае нескольких решений при минимуме $f$, будем минимизировать также
$$g = \max(B).$$

В таком виде задача удобна для симплекс-метода


### Анализ задачи в терминах симплекс-метода

$$m = q;\; n = q-1;$$
$$
X_0 = \begin{pmatrix}
	s_1 \\
	\vdots \\
	s_{q-1}
\end{pmatrix}
;\;
Y_0 = \begin{pmatrix}
	p_1 \\
	\vdots \\
	p_{q}
\end{pmatrix};
$$
$$A_0 : Matrix(q, q-1),\,
\begin{cases}
	A_0[i,j] = -1, & j = i \vee j = i-1, \\
	A_0[i,j] = 0, & j \ne i \wedge j \ne i-1;
\end{cases}
$$
$$b_0 = \begin{pmatrix}
	a_1 \\
	\vdots \\
	a_q
\end{pmatrix};$$

$$
\begin{cases}
	\hat A_0[i,j] = A_0[i,j], & j \le q-1,\\
	\hat A_0[i,j] = b_0[i], & j = q;
\end{cases}
\Rightarrow
\begin{cases}
	\hat A_0[i,j] = -1, & j \le q-1 \wedge (j = i \vee j = i-1),\\
	\hat A_0[i,j] = 0, & j \le q-1 \wedge j \ne i \wedge j \ne i-1,\\
	\hat A_0[i,j] = a_j, & j = q.
\end{cases}
$$


$$c_0 = 1_{q-1, 1};\; d_0 = 0.$$

Целевую функцию будем максимизировать.

#### Шаг 0

На первом шаге можно выбрать любую входную переменную: $1 \le \#x_0 \le q-1$.

$$S_0[i] = -\frac{b_0[i]}{A_0[i,\#x_0]};
\Rightarrow
\begin{cases}
	S_0[i] = a_i, & \#x_0 = i \vee \#x_0 = i-1,\\
	S_0[i] = -\infty, & \#x_0 \ne i \wedge \#x_0 \ne i-1;
\end{cases}
$$

Исходя из этой таблицы, выбрать можно только $\#y_0 = \#x_0$ или $\#y_0 = \#x_0 + 1$.

$N_{0,1}$ отличается от $\hat A_0$ только строкой $\#y_0$, которая заменена на $\#x_0$ строку единичной матрицы.
$$
\begin{cases}
	N_{0,1}[i,j] = \hat A_0[i,j], & i \ne \#y_0, \\
	N_{0,1}[i,j] = 1, & i = \#y_0 \wedge j = \#x_0, \\
	N_{0,1}[i,j] = 0, & i = \#y_0 \wedge j \ne \#x_0;
\end{cases}
\Rightarrow
\begin{cases}
	N_{0,1}[i,j] = -1, & i \ne \#y_0 \wedge j \le n \wedge (j = i \vee j = i-1), \\
	N_{0,1}[i,j] = 0, & i \ne \#y_0 \wedge j \le n \wedge j \ne i \wedge j \ne i-1, \\
	N_{0,1}[i,j] = a_j, & i \ne \#y_0 \wedge j = n+1, \\
	N_{0,1}[i,j] = 1, & i = \#y_0 \wedge j = \#x_0, \\
	N_{0,1}[i,j] = 0, & i = \#y_0 \wedge j \ne \#x_0;
\end{cases}
$$

$B_{0,1}$ отличается от единичной матрицы только строкой $\#x_0$, которая заменена на $\#y_0$ строку матрицы $\hat A_0$.
$$
\begin{cases}
	B_{0,1}[i,j] = 1, & i \ne \#x_0 \wedge i=j,\\
	B_{0,1}[i,j] = 0, & i \ne \#x_0 \wedge i \ne j,\\
	B_{0,1}[i,j] = \hat A_0[\#y_0,j], & i = \#x_0;
\end{cases}
\Rightarrow
\begin{cases}
	B_{0,1}[i,j] = 1, & i \ne \#x_0 \wedge i=j,\\
	B_{0,1}[i,j] = 0, & i \ne \#x_0 \wedge i \ne j,\\
	B_{0,1}[i,j] = -1, & i = \#x_0 \wedge (j = \#y_0 \vee j = \#y_0-1), \\
	B_{0,1}[i,j] = 0, & i = \#x_0 \wedge j \le n \wedge j \ne \#y_0 \wedge j \ne \#y_0-1, \\
	B_{0,1}[i,j] = a_j, & i = \#x_0 \wedge j = n+1);
\end{cases}
$$

В зависимости от выбранного $\#y_0$, условие $(j = \#y_0 \vee j = \#y_0-1)$ обращается в $(j = \#x_0 \vee j = \#x_0-1)$ или $(j = \#x_0+1 \vee j = \#x_0)$

Значит имеет место подсистема:

$$\begin{cases}
	B_{0,1}[i,j] = 1, &  i=j \wedge i \ne \#x_0,\\
	B_{0,1}[i,j] = -1, &  i=j \wedge i = \#x_0;\\
\end{cases}
$$


Т.о. матрица $B_{0,1}$ отличается от единичной матрицы одной строкой, причём в этой строке на главной диагонали стоит единица. Такая матрица инволютивна.

$$B_{0,1}^{-1} = B_{0,1};$$

$$\hat A_1 = N_{0,1} B_{0,1}^{-1} = N_{0,1} B_{0,1};$$

$$\hat A_1[i,j] = \sum_{r=1}^m N_{0,1}[i,r] B_{0,1}[r,j];$$

Для случая $y_0 = x_0$ запишем:
$$\begin{cases}
	B_{0,1}[i,j] = 1, & i \ne \#x_0 \wedge i=j,\\
	B_{0,1}[i,j] = 0, & i \ne \#x_0 \wedge i \ne j,\\
	B_{0,1}[i,j] = -1, & i = \#x_0 \wedge (j = \#x_0 \vee j = \#x_0-1), \\
	B_{0,1}[i,j] = 0, & i = \#x_0 \wedge j \le n \wedge j \ne \#x_0 \wedge j \ne \#x_0-1, \\
	B_{0,1}[i,j] = a_j, & i = \#x_0 \wedge j = n+1);
\end{cases}
\Rightarrow
\begin{cases}
	B_{0,1}[i,j] = 1, & j<\#x_0-1 \wedge i=j,\\
	B_{0,1}[i,j] = 0, & j<\#x_0-1 \wedge i \ne j,\\
	B_{0,1}[i,j] = -1, & j = \#x_0-1 \wedge i = \#x_0,\\
	B_{0,1}[i,j] = 1, & j = \#x_0-1 \wedge i = \#x_0-1,\\
	B_{0,1}[i,j] = 0, & j = \#x_0-1 \wedge (i < \#x_0-1 \vee i>\#x_0),\\
	B_{0,1}[i,j] = -1, & j = \#x_0 \wedge i = \#x_0,\\
	B_{0,1}[i,j] = 0, & j = \#x_0 \wedge i \ne \#x_0,\\
	B_{0,1}[i,j] = 1, & \#x_0< j \le n \wedge i=j,\\
	B_{0,1}[i,j] = 0, & \#x_0< j \le n \wedge i \ne j,\\
	B_{0,1}[i,j] = a_j, & j = n+1 \wedge i=\#x_0,\\
	B_{0,1}[i,j] = 0, & j = n+1 \wedge i \ne \#x_0 \wedge i<n+1,\\
	B_{0,1}[i,j] = 1, & j = n+1 \wedge i = n+1;
\end{cases}
$$
$$\begin{cases}
	\hat A_1[i,j] = 0, & i=\#y0 \wedge j < \#x0 -1,\\
	\hat A_1[i,j] = -1, & i=\#y0 \wedge j = \#x0 -1,\\
	\hat A_1[i,j] = -1, & i=\#y0 \wedge j = \#x0,\\
	\hat A_1[i,j] = 0, & i=\#y0 \wedge \#x0 < j \le n,\\
	\hat A_1[i,j] = a_j, & i=\#y0 \wedge \#x0 = n+1,\\

	\hat A_1[i,j] = , & i \ne \#y0 \wedge j < \#x0 -1,\\
	\hat A_1[i,j] = , & i \ne \#y0 \wedge j = \#x0 -1,\\
	\hat A_1[i,j] = , & i \ne \#y0 \wedge j = \#x0,\\
	\hat A_1[i,j] = , & i \ne \#y0 \wedge \#x0 < j \le n,\\
	\hat A_1[i,j] = , & i \ne \#y0 \wedge \#x0 = n+1,\\
	
	

Для случая $y_0 = x_0+1$ запишем:
$$\begin{cases}
	B_{0,1}[i,j] = 1, & i \ne \#x_0 \wedge i=j,\\
	B_{0,1}[i,j] = 0, & i \ne \#x_0 \wedge i \ne j,\\
	B_{0,1}[i,j] = -1, & i = \#x_0 \wedge (j = \#x_0 \vee j = \#x_0+1), \\
	B_{0,1}[i,j] = 0, & i = \#x_0 \wedge j \le n \wedge j \ne \#x_0 \wedge j \ne \#x_0+1, \\
	B_{0,1}[i,j] = a_j, & i = \#x_0 \wedge j = n+1);
\end{cases}
\Rightarrow
\begin{cases}
	B_{0,1}[i,j] = 1, & j<\#x_0 \wedge i=j,\\
	B_{0,1}[i,j] = 0, & j<\#x_0 \wedge i \ne j,\\
	B_{0,1}[i,j] = -1, & j = \#x_0 \wedge i = \#x_0,\\
	B_{0,1}[i,j] = 1, & j = \#x_0 \wedge i = \#x_0+1,\\
	B_{0,1}[i,j] = 0, & j = \#x_0 \wedge (i < \#x_0 \vee i>\#x_0+1),\\
	B_{0,1}[i,j] = -1, & j = \#x_0+1 \wedge i = \#x_0,\\
	B_{0,1}[i,j] = 0, & j = \#x_0+1 \wedge i \ne \#x_0,\\
	B_{0,1}[i,j] = 1, & \#x_0+1< j \le n \wedge i=j,\\
	B_{0,1}[i,j] = 0, & \#x_0+1< j \le n \wedge i \ne j,\\
	B_{0,1}[i,j] = a_j, & j = n+1 \wedge i=\#x_0,\\
	B_{0,1}[i,j] = 0, & j = n+1 \wedge i \ne \#x_0 \wedge i<n+1,\\
	B_{0,1}[i,j] = 1, & j = n+1 \wedge i = n+1;
\end{cases}
$$