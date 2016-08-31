defmodule Array.Mixfile do
  use Mix.Project

  # TODO: elixir todo
  # elixir todo line 2
  def project do
    [app: :array,
     version: "1.0.1",
     elixir: ">= 1.0.0",
     description: "An elixir wrapper library for Erlang's array.",
     package: package,
     deps: deps]
  end

  # Configuration for the OTP application
  #
  # Type `mix help compile.app` for more information
  def application do
    [applications: [:logger]]
  end

  # Dependencies can be Hex packages:
  #
  #   {:mydep, "~> 0.3.0"}
  #
  # Or git/path repositories:
  #
  #   {:mydep, git: "https://github.com/elixir-lang/mydep.git", tag: "0.1.0"}
  #
  # Type `mix help deps` for more examples and options
  defp deps do
    [{:earmark, ">= 0.0.0", only: :dev},
     {:ex_doc, "~> 0.6", only: :dev}]
  end

  defp package do
    [files: ["lib", "mix.exs", "README*"],
     contributors: ["Kohei Takeda"],
     licenses: ["Apache 2.0"],
     links: %{"GitHub" => "https://github.com/takscape/elixir-array"}]
  end
end