---
title: "Type Inference Implementation"
date: 2020-08-17
weight: 2
description: >
  型推論システムの実装アルゴリズムの解説
draft: true
---

mimiumは静的型付け言語ですが、OCamlなどと同様に変数宣言や関数の引数などで型名を省略してもコンパイルできる型推論を導入しています。（現在のところ複数の型に対する関数をまとめて定義できるジェネリクスは導入していません。）

この型推論のシステムはHindley-Milner型推論に則ったものです。ここではC++での実装の実例があまり見られなかったのでメモとして残しておきます。

{{% pageinfo %}}
ここで書かれているコードの例はmimiumのコンパイラに実際使われているものとは技術的負債などの影響により少々異なっていることをあらかじめ断っておきます（むしろ後々このドキュメントに書かれている形に近づけていく予定です）。
{{% /pageinfo %}}

mimiumでの実装の参考にしたものとしては以下の記事などがあります。

[型推論 - 速攻MinCamlコンパイラ概説(Eijiro Sumii)](http://esumii.github.io/min-caml/tutorial-mincaml-8.htm)

[Hindley-Milner型推論をCで実装した話 - free(malloc(sizeof(MRM))); 虚無・アクセラレーション(mkei)](https://admarimoin.hatenablog.com/entry/2019/12/30/000337)

[手続き型脳で型推論を実装してみた - κeenのHappy Hacκing Blog(κeen)](https://keens.github.io/blog/2019/12/08/tetsuzukigatanoudekatasuironwojissoushitemita/)

[人でもわかる型推論(uint256_t)](https://qiita.com/uint256_t/items/7d8c8feeffc03b388825)

## コードサンプル

今回はたとえば以下のようなコードの形を推論してみます。

```rust

fn add(x,y){
    return x+y
}

fn hof(a,b,c){
    localvar = a+c
    return |z|{ return b(z,localvar) }
}

result = hof(100,add,20)(20)

```

あまり実用的なコードかどうかは置いておいて、2引数の関数、3引数の関数をとって1引数の関数を返す高階関数と、出てくる方は数値or関数の2種類ですが、全部方シグネチャを書くにはそれなりにめんどくさいコードです。

早速ですが[std::variantを使った型のデータ型](/ja/docs/development/codingstyle/#動的多相-dynamic-polymorphism)を定義します。


```cpp
namespace types{

struct Number{};
struct Void{};
//forward declaration
struct Function;
struct TypeVar;

using Value = std::variant<Number,Void,Rec_Wrap<Function>,Rec_Wrap<TypeVar>>
struct Function{
    Value ret_type;
    std::vector<Value> arg_types;
};
struct TypeVar{
    int id;
    std::optional<Value> contained;
};

}//namespace types
```
こんな感じです。一応void型も定義しておきました。`TypeVar`は推論を行う途中で出てくる仮の型で、新しく出てくるたびにidを割り振ります。実際の型が決定されたら`contained`に放り込みます。

次に、シンボル名と型のペアを入れておく型環境を定義します。本来はシンボル名がスコープによってダブる可能性がありますが、実際のコンパイラでは推論する前にシンボルをリネームしてコリジョンが発生しないようにしているので、1つのハッシュマップに詰め込んでしまいます。今回のサンプルコードではそもそもコリジョンしません。

```cpp
struct TypeLink{
    std::optional<int> next;
    std::optional<int> prev;
};
struct TypeEnv{
    std::unordered_map<std::string,types::Value> env;
    std::vector<TypeLink> tv_container;
};

```

新しくTypeLinkという型を作りました。これはtv_containerという配列に入れた各TypeVarのインデックス同士が制約を付けていくことで、同じ型の型変数は最終的にnextとprevで双方向リストとして繋がれるような形を作るためです。イメージが湧きにくいと思うので、画像を使いながら解説します。

