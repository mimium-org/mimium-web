---
title: Coding Style
date: 2020-08-16
weight: 2
description: |
  Coding styles used in a development of mimium
draft: true
---

## Basic Policy

- language specification (LS) conforms to C++17.The main reason is why Code Template Inference improve readability such as `if constexpr` beacuse mimium use actively `std::variant` or `std::optional`. 
- **If you are uncertain about readability or a slight improvement in execution speed, take readability.**In the first place C++ is guranteerd to be reasonably fast, so it doesn't matter if it can be a little rich processing, that degree of hesitation is about same when optimized. 
- Avoid using external libraries as much as possible(especialy for general purpose such as boost).And STL is actively used.
    - The compiler depends on bison(yacc) and flex(lex) as parser.This is especially valuable as bison source document,so we plan to continue using in the future, but there are problems Unicode not being able to be loaded for flex, I may move to REflex etc. or switch to manual implementation.Under consideration.
    - The runtime currently depends on libsndfile etc. for reading audio file, but we would like to separate it as a project structure later because it is only needed at runtime.
- Mimium does not use raw pointers.Basically mimium uses `std::shared_ptr<T>`.But `llvm::Type*` in the LLVM library and `llvm::Value*` are not limited to this because they implement their own reference counting.
- In the conditional expression(e.g.*if block*),mimium does not use the fact the pointer variable is empty with `nullptr`.Even if it takes some effort,the document value of the source code itself is improved by using `std::optional<std::shared_ptr<T>>`.

## Dynamic Polymorphism

There are two types of **polymorphism** that switches indivisual processing for each **type** in C++:**Static Polymorphism**, which determines the type at compile time, and **Dynamic Polymorphism**, which determines the operation at runtime.**Static Polymorphism** is mainly implemented by templates, and ** Dynamic Polymorphism** is mainly implemented by inheritance and virtual function.

しかしmimiumの開発では動的多相に仮想関数を基本的に使用しません。代わりにC++17よりSTLに導入された`std::variant`を用います。`std::variant<T1,T2,T3...>`はT1~Tnの複数種類のどれかの型を持つ変数を代入できる型であり、`std::get<T>`や`std::visit()`を用いることで動的に型に応じての処理を分けることが可能になります。これは関数型などでよく見られる **直和型** と呼ばれる型の代わりでもあり、`std::visit`はテンプレートやconstexprを用いた処理分けと組み合わせるといわゆるパターンマッチングに近い処理を可能にします。内部実装的には取りうる型の最大値のメモリ分+現在どの型を保持しているのかのタグ（整数）を確保する形になっているので **Tagged Union**とも呼ばれます。

mimiumにおける具体的な型でいうと抽象構文木である`mimium::ast::Expr`や`mimium::ast::Statement`、中間表現である`mimium::mir::Instruction`、（mimium言語における）型を表す`mimium::types::Value`などが`std::variant`へのエイリアスです。

仮想関数よりも`variant`を用いるメリットはなんでしょうか？1つは、実行コストがかかることです。仮想関数は実行時に関数へのテーブルを保持し仮想関数が呼び出されるたびにそれを参照する必要があるため、`std::variant`を用いた多相の方が実行速度では一般的に有利だとされています。

もう1つはアップキャストの問題です。抽象構文木のような木構造のデータを渡りながら処理をする時、どうしても

- 継承した個別の型を基底クラスのポインターでダウンキャストして受け取る
- 仮想関数を用いて型に応じた処理をする
- 処理したあと帰ってきたポインターを元の型に戻し（**アップキャスト**）、さらに処理を続ける

といったパターンが発生します。このアップキャストは一般的なコーディングでは、間違った型へキャストして終えば予測不可能な挙動が起きるので御法度とされています。仮想関数で用いている実行時型情報（RTTI）を用いる`dynamic_cast`を使って動的に型検査をして安全にアップキャストする方法もありますが、記述が長くなりがちなども問題もあります。一方で`std:variant`を使用するとこのようなダウン→アップキャストの必要はないので型情報が明確に取り扱えます。

またこうした（型に応じた処理を複数種類）x（複数の型）と組み合わせる方法はデザインパターンの中ではビジターパターンとも呼ばれ、 `std::visit(function_object,variant_variable)`ではこの形が引数としてシンプルに表されています。一方仮想関数を使ってのビジターパターンはデータ側にacceptと呼ばれるメソッドを実装しておく必要があるので、データはデータ、関数は関数というように構造を分離することが難しくなります。

## 再帰的データ構造

`std::variant`にも難しい点はあります。そのうち重要な点は再帰的データ構造がそのままでは扱えないことです。[^boostrv]

[^boostrv]: std::variantの実装の元となったBoostには再帰データを扱えるrecursive_variantが存在していますが、今のところそのためだけにboostを利用するくらいならばヘルパークラスを一つ用意することで解決するという方針をとっています。

たとえば、`types::Value`は`types::Float`や`types::Function`など取りうる型すべてを含んでいますが、ここで`types::Function`のメンバ変数にはたとえば返り値を表す型として`types::Value`が含まれてしまっています。

`std::variant`は通常の数値型のデータなどと同じように、取りうる型の最大値分だけメモリをスタック確保し、ヒープアロケーションは行わない仕様となっており、再帰的なデータ構造の場合はデータサイズを静的に決定できなくなってしまうのでコンパイルできなくなります。

これを回避するためには、再帰的な部分を持つデータについては実体の代わりにポインタを格納するなどの方法が考えられるのですが、初期化やメンバアクセスなどが統一されないためややこしくなるなどの問題があるため、mimiumでは次の記事を参考にしたヘルパークラスを利用しています。

[Breaking Circular Dependencies in Recursive Union Types With C++17 - Don’t Compute In Public(last view:2020-08-17)](https://medium.com/@dennis.luxen/breaking-circular-dependencies-in-recursive-union-types-with-c-17-the-curious-case-of-4ab00cfda10d)

具体的には内部の`T`の実体を要素数1の`std::vector<T>`に確保し、キャスト演算子として`T& ()`を実装しimplicitに元の型から構築、キャストして参照を受け取ることができるようにしています。`std::vector`は`T`の中身が不完全なままでもスタック上のデータサイズを確定させることができるのでコンパイルが通るようになるのです。

記事中の`recursive_wrapper<T>`を、mimium内部では`Rec_Wrap<T>`と名付け、さらにこの型を`rT`（たとえば`Function`に対して`rFunction`といった形で）エイリアスしています。


```cpp

using Value = std::variant<None, Void, Float, String, rRef, rTypeVar, rPointer, rFunction,rClosure, rArray, rStruct, rTuple, rAlias>;
/*~~~~~*/
using rFunction = Rec_Wrap<Function>;
/*~~~~~*/
struct Function : Aggregate {
  Value ret_type;
  std::vector<Value> arg_types;
};

```

たとえば`std::visit`でパターンマッチングする時にはビジターの関数オブジェクトの`operator()`オーバーロードを以下のようにします。

```cpp

types::Value operator()(types::Function& f){
    return  someProcess(f);
}
/*~~~~~*/
template<typename T>
types::Value operator()(Rec_Wrap<T>& t){
    return  (*this)(static_cast<T&>(t));
}

```

`Rec_Wrap<T>`を一度キャストして剥がしてもう一度自分自身を適用するテンプレート関数を使います。`operator()(Rec_Wrap<types::Function>& rf)`を直接オーバーロードしても構わないのですが、この`rf`は直接メンバアクセスができないため一度ローカル変数で`types::Function&`にキャストしてやらないといけなかったりする二度手間が発生します。

## エラー処理、例外

`try`、`throw`、`catch`と言ったC++標準のエラー処理を積極的に利用します。`throw`を使ったエラー処理は実行コストが高いというデメリットがあるものの、正常系で処理をしている間はコストがかからず、言語組み込みの仕様なのでエラー処理部の可読性が高まります。

optionalなどを活用したエラー処理クラスの実装は型シグネチャが複雑になり可読性が下がるなどのデメリットもあります。ただ内部的に使用しているLLVMのライブラリでは実行速度を重視して`Expected`クラスなどでこの形式でエラー処理をしているため、こちらと`try`、`catch`のエラー処理を混ぜるのはあまり効率がよくはない、混乱するといった問題点も存在しています。

現状ではコンパイラもランタイムもtry/catchのエラー処理を使用していますが、ランタイム側では実行時間にセンシティブである、今後組み込み向けなどに移植される可能性もあると言った事情を考えるとoptional等を活用した処理に変更するかもしれません。

基本的に`try`,`catch`はコンパイラでの処理のはじめに行い深くネストすることはしません。どの道、ほとんどのケースでエラーが起きれば最終的にコンパイルエラーの形に帰着するためです。必要に応じてエラークラスを継承して種類分けし、catchしたところでまとめてエラーの型ごとにメッセージ等を個別に処理します。( **エラークラスの定義は今後の課題**)